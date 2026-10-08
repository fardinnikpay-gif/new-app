import Order from "../models/Order.js";
import User from "../models/User.js";
import * as pricingService from "./pricingService.js";
import * as inventoryService from "./inventoryService.js";
import * as couponService from "./couponService.js";
import { sendEmail } from "./emailService.js";
import { orderConfirmationEmail } from "../utils/emailTemplates.js";

// Snapshot of what the customer bought, so deleting a product never breaks old orders
const toOrderItems = (lineItems) =>
  lineItems.map(({ product, title, image, size, color, qty, price }) => ({
    product,
    title,
    image,
    size,
    color,
    qty,
    price,
  }));

// Stock is already reserved when this runs; any failure here must undo it (and the coupon claim)
const persistOrder = async ({ userId, shippingAddress, paymentMethod, pricing }) => {
  let couponClaimed = false;
  try {
    if (pricing.couponCode) {
      await couponService.claimUse(pricing.couponCode);
      couponClaimed = true;
    }
    return await Order.create({
      user: userId,
      items: toOrderItems(pricing.lineItems),
      shippingAddress,
      itemsPrice: pricing.itemsPrice,
      discountAmount: pricing.discountAmount,
      shippingPrice: pricing.shippingPrice,
      totalPrice: pricing.totalPrice,
      couponCode: pricing.couponCode ?? undefined,
      paymentMethod,
      isPaid: false,
      status: "pending",
    });
  } catch (error) {
    await inventoryService.releaseStock(pricing.lineItems);
    if (couponClaimed) await couponService.releaseUse(pricing.couponCode);
    throw error;
  }
};

// Fire-and-forget: must never throw and never delay or break the order response
const sendConfirmationEmail = async (order, userId) => {
  try {
    const user = await User.findById(userId).select("email").lean();
    if (!user?.email) return; // phone-only accounts get no email
    const { subject, html } = orderConfirmationEmail(order);
    await sendEmail({ to: user.email, subject, html });
  } catch (error) {
    console.error("Order confirmation email failed:", error.message);
  }
};

export const createOrder = async ({ userId, items, shippingAddress, paymentMethod, couponCode }) => {
  // Always recalculated from the database, never from the client's preview
  const pricing = await pricingService.calculateOrderPricing({ items, couponCode });

  await inventoryService.reserveStock(pricing.lineItems);
  const order = await persistOrder({ userId, shippingAddress, paymentMethod, pricing });

  void sendConfirmationEmail(order, userId);
  return order;
};