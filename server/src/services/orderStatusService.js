import Order from "../models/Order.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import * as orderService from "./orderService.js";
import * as paymentService from "./paymentService.js";
import { sendEmail } from "./emailService.js";
import { orderStatusEmail } from "../utils/emailTemplates.js";
import { toCustomerView } from "./orderQueryService.js";

const TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

// Fire-and-forget: must never throw and never roll back a status change
const notifyStatusChange = async (order) => {
  try {
    const user = await User.findById(order.user).select("email").lean();
    if (!user?.email) return; // phone-only or deleted accounts get no email
    const { subject, html } = orderStatusEmail(order);
    await sendEmail({ to: user.email, subject, html });
  } catch (error) {
    console.error("Order status email failed:", error.message);
  }
};

const assertTransition = (order, nextStatus) => {
  const allowed = TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, `Cannot change order status from ${order.status} to ${nextStatus}`);
  }
  // An unpaid Stripe order must not be processed or shipped (only cancelled)
  if (order.paymentMethod === "stripe" && !order.isPaid && nextStatus !== "cancelled") {
    throw new ApiError(400, "This Stripe order has not been paid yet");
  }
};

// Runs only for the winner of the atomic status change, so stock is restored exactly once
const settleCancelledOrder = async (order) => {
  await orderService.restoreStock(order);
  if (order.paymentMethod !== "stripe" || !order.paymentIntentId) return;

  if (order.isPaid) await paymentService.refundPayment(order.paymentIntentId);
  else await paymentService.cancelPaymentIntent(order.paymentIntentId);
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId).select("user").lean();
  if (!order) throw new ApiError(404, "Order not found");
  if (String(order.user) !== String(userId)) {
    throw new ApiError(403, "You do not have access to this order");
  }

  // Atomic: only a pending, unpaid order of THIS user can be cancelled, and only once
  const cancelled = await orderService.cancelPendingOrder({ _id: orderId, user: userId });
  if (!cancelled) throw new ApiError(400, "Only pending orders can be cancelled");

  // Makes the order impossible to pay afterwards
  if (cancelled.paymentIntentId) await paymentService.cancelPaymentIntent(cancelled.paymentIntentId);

  void notifyStatusChange(cancelled);
  return toCustomerView(cancelled);
};

export const updateOrderStatus = async (orderId, nextStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  assertTransition(order, nextStatus);

  // The condition on the current status makes this safe against concurrent changes
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, status: order.status },
    { $set: { status: nextStatus } },
    { new: true }
  );
  if (!updated) {
    throw new ApiError(409, "Order status changed in the meantime, please refresh and try again");
  }

  if (nextStatus === "cancelled") await settleCancelledOrder(updated);
  void notifyStatusChange(updated);
  return updated;
};

export const markAsPaid = async (orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentMethod: "cod", isPaid: false, status: { $ne: "cancelled" } },
    { $set: { isPaid: true, paidAt: new Date() } },
    { new: true }
  );
  if (order) return order;

  // Only on failure: find out why, to return the right error
  const existing = await Order.findById(orderId).select("paymentMethod isPaid").lean();
  if (!existing) throw new ApiError(404, "Order not found");
  if (existing.paymentMethod !== "cod") {
    throw new ApiError(400, "Only cash-on-delivery orders can be marked as paid manually");
  }
  if (existing.isPaid) throw new ApiError(400, "Order is already paid");
  throw new ApiError(400, "A cancelled order cannot be marked as paid");
};