import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import { config } from "../config/env.js";
import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import * as orderService from "./orderService.js";

// Assumes a 2-decimal currency (EUR, USD, ...). Zero-decimal currencies such as JPY need different math.
const toMinorUnits = (amount) => Math.round(amount * 100);

const assertPayable = (order, userId) => {
    if (String(order.user) !== String(userId)) {
        throw new ApiError(403, "You cannot pay for this order");
    }
    if (order.paymentMethod !== "stripe") throw new ApiError(400, "This order is not a Stripe order");
    if (order.isPaid) throw new ApiError(400, "This order is already paid");
    if (order.status !== "pending") throw new ApiError(400, "This order can no longer be paid");
};

export const createPaymentIntent = async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    assertPayable(order, userId);

    let intent;
    try {
        intent = await stripe.paymentIntents.create(
            {
                amount: toMinorUnits(order.totalPrice), // always from the database
                currency: config.stripeCurrency,
                automatic_payment_methods: { enabled: true },
                metadata: { orderId: String(order._id) },
            },
            // Same key = Stripe returns the same intent, so double clicks never create two
            { idempotencyKey: `order-intent-${order._id}` }
        );
    } catch (error) {
        console.error("Stripe createPaymentIntent failed:", error.message);
        throw new ApiError(502, "Payment provider error, please try again");
    }

    await Order.updateOne({ _id: order._id }, { $set: { paymentIntentId: intent.id } });
    return { clientSecret: intent.client_secret };
};

// Best-effort: makes a cancelled order impossible to pay afterwards
export const cancelPaymentIntent = async (intentId) => {
    try {
        await stripe.paymentIntents.cancel(intentId);
    } catch (error) {
        console.error(`Could not cancel PaymentIntent ${intentId}:`, error.message);
    }
};

// Customer paid for an order we already cancelled: give the money back
const refundPayment = async (intentId) => {
    try {
        await stripe.refunds.create(
            { payment_intent: intentId },
            { idempotencyKey: `refund-${intentId}` }
        );
        console.warn(`Refunded PaymentIntent ${intentId} (order was already cancelled)`);
    } catch (error) {
        console.error(`REFUND FAILED for PaymentIntent ${intentId}, refund manually:`, error.message);
    }
};

const getOrderId = (intent) => {
    const orderId = intent.metadata?.orderId;
    return mongoose.isValidObjectId(orderId) ? orderId : null;
};

const onPaymentSucceeded = async (intent) => {
    const orderId = getOrderId(intent);
    if (!orderId) return; // not one of our orders (e.g. CLI test event)

    // Atomic and idempotent: a duplicate event finds nothing to update
    const order = await Order.findOneAndUpdate(
        { _id: orderId, paymentIntentId: intent.id, isPaid: false, status: "pending" },
        { $set: { isPaid: true, paidAt: new Date(), status: "processing" } },
        { new: true }
    );
    if (order) return;

    const existing = await Order.findOne({ _id: orderId, paymentIntentId: intent.id })
        .select("status")
        .lean();
    if (existing?.status === "cancelled") await refundPayment(intent.id);
};

const onPaymentFailed = async (intent) => {
    const orderId = getOrderId(intent);
    if (!orderId) return;

    const cancelled = await orderService.cancelPendingOrder({
        _id: orderId,
        paymentIntentId: intent.id,
    });
    if (cancelled) await cancelPaymentIntent(intent.id);
};

export const handleWebhook = async (rawBody, signature) => {
    let event;
    try {
        // rawBody must be the untouched Buffer, otherwise the signature never matches
        event = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
    } catch {
        throw new ApiError(400, "Invalid webhook signature");
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            await onPaymentSucceeded(event.data.object);
            break;
        case "payment_intent.payment_failed":
            await onPaymentFailed(event.data.object);
            break;
        default:
            break; // unknown events are acknowledged so Stripe does not retry them
    }
};