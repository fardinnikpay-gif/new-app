import { config } from "../config/env.js";
import { RESET_TOKEN_TTL_MS } from "../models/User.js";
import { toCents, fromCents } from "./money.js";

const STORE_NAME = "Clothing Store";

// Every dynamic value goes through esc(): names, titles and addresses are user input
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);

const money = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency.toUpperCase() }).format(amount);

const orderRef = (order) => String(order._id ?? order.id).slice(-8).toUpperCase();

const paragraph = (text) => `<p style="margin:0 0 16px;line-height:1.5;">${text}</p>`;

const button = (href, label) =>
  `<p style="margin:24px 0;"><a href="${esc(href)}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;">${esc(label)}</a></p>`;

const layout = (heading, content) => `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:22px;">${esc(heading)}</h1>
    ${content}
    <p style="margin:32px 0 0;font-size:12px;color:#71717a;">${esc(STORE_NAME)}</p>
  </div>
</body>
</html>`;

export const welcomeEmail = (user) => ({
  subject: `Welcome to ${STORE_NAME}`,
  html: layout(
    `Welcome, ${user.name}!`,
    paragraph("Thank you for creating an account. You can now save addresses, track your orders and check out faster.") +
      button(config.clientUrl, "Visit the store")
  ),
});

const orderTable = (order) => {
  const rows = order.items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">${esc(item.title)}<br><span style="font-size:12px;color:#71717a;">${esc(item.size)} / ${esc(item.color)}</span></td>
        <td style="padding:8px;border-bottom:1px solid #e4e4e7;text-align:center;">${esc(item.qty)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:right;">${money(fromCents(toCents(item.price) * item.qty))}</td>
      </tr>`
    )
    .join("");

  const line = (label, value, bold = false) =>
    `<tr><td colspan="2" style="padding:4px 0;text-align:right;${bold ? "font-weight:bold;" : ""}">${esc(label)}</td><td style="padding:4px 0;text-align:right;${bold ? "font-weight:bold;" : ""}">${value}</td></tr>`;

  const discount =
    order.discountAmount > 0
      ? line(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `-${money(order.discountAmount)}`)
      : "";

  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
    <tr><th style="text-align:left;padding-bottom:8px;">Item</th><th style="padding-bottom:8px;">Qty</th><th style="text-align:right;padding-bottom:8px;">Price</th></tr>
    ${rows}
    ${line("Items", money(order.itemsPrice))}
    ${discount}
    ${line("Shipping", money(order.shippingPrice))}
    ${line("Total", money(order.totalPrice), true)}
  </table>`;
};

const addressBlock = (address = {}) =>
  `<p style="margin:0 0 16px;line-height:1.5;font-size:14px;"><strong>Shipping to</strong><br>${esc(address.fullName)}<br>${esc(address.street)}<br>${esc(address.city)} ${esc(address.postalCode)}<br>${esc(address.phone)}</p>`;

const paymentLine = (order) => {
  const method = order.paymentMethod === "stripe" ? "Card" : "Cash on delivery";
  const state = order.isPaid ? "paid" : "payment pending";
  return paragraph(`<strong>Payment:</strong> ${method} (${state})`);
};

const orderIdNote = (order) =>
  `<p style="margin:16px 0 0;font-size:12px;color:#71717a;">Order id: ${esc(order._id ?? order.id)}</p>`;

export const orderConfirmationEmail = (order) => ({
  subject: `Order confirmation #${orderRef(order)}`,
  html: layout(
    "Thank you for your order!",
    paragraph(`Hi ${esc(order.shippingAddress?.fullName)}, we received your order <strong>#${orderRef(order)}</strong>.`) +
      orderTable(order) +
      paymentLine(order) +
      addressBlock(order.shippingAddress) +
      orderIdNote(order)
  ),
});

const STATUS_COPY = {
  pending: ["We received your order", "Your order is waiting to be processed."],
  processing: ["Your order is being prepared", "We are getting your order ready."],
  shipped: ["Your order is on its way", "Your order has been shipped."],
  delivered: ["Your order was delivered", "Your order has been delivered. We hope you enjoy it!"],
  cancelled: ["Your order was cancelled", "Your order has been cancelled. If you have any questions, please contact us."],
};

export const orderStatusEmail = (order) => {
  const [title, message] = STATUS_COPY[order.status] ?? [
    "Order update",
    `The status of your order is now: ${order.status}.`,
  ];
  return {
    subject: `${title} (#${orderRef(order)})`,
    html: layout(
      title,
      paragraph(`Hi ${esc(order.shippingAddress?.fullName)}, ${esc(message)}`) +
        paragraph(`Order <strong>#${orderRef(order)}</strong> - total ${money(order.totalPrice)}`) +
        orderIdNote(order)
    ),
  };
};

export const couponEmail = (coupon) => {
  const offer = coupon.type === "percent" ? `${coupon.value}% off` : `${money(coupon.value)} off`;
  const conditions = [];
  if (coupon.minOrder > 0) conditions.push(`Valid on orders of ${money(coupon.minOrder)} or more.`);
  if (coupon.expiresAt) conditions.push(`Valid until ${new Date(coupon.expiresAt).toISOString().slice(0, 10)}.`);

  return {
    subject: `${offer} your next order`,
    html: layout(
      "A discount just for you",
      paragraph(`Use this code at checkout to get <strong>${esc(offer)}</strong>:`) +
        `<p style="margin:0 0 16px;font-size:24px;font-weight:bold;letter-spacing:2px;">${esc(coupon.code)}</p>` +
        (conditions.length ? paragraph(esc(conditions.join(" "))) : "") +
        button(config.clientUrl, "Shop now")
    ),
  };
};

export const resetPasswordEmail = (url) => {
  const minutes = Math.round(RESET_TOKEN_TTL_MS / 60000);
  return {
    subject: "Reset your password",
    html: layout(
      "Reset your password",
      paragraph(`We received a request to reset your password. This link is valid for ${minutes} minutes.`) +
        button(url, "Choose a new password") +
        paragraph(`If the button does not work, copy this link into your browser:<br><span style="font-size:12px;word-break:break-all;">${esc(url)}</span>`) +
        paragraph("If you did not ask for this, you can ignore this email: your password will not change.")
    ),
  };
};