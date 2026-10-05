import mongoose from "mongoose";
import { moneyValidator, toCents } from "../utils/money.js";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
export const PAYMENT_METHODS = ["cod", "stripe"];

const MAX_ITEMS = 50;
const isInteger = { validator: Number.isInteger, message: "Must be an integer" };
const requiredText = (label, max) => ({ type: String, required: [true, `${label} is required`], trim: true, maxlength: max });
const money = (label) => ({ type: Number, required: [true, `${label} is required`], min: [0, `${label} cannot be negative`], validate: moneyValidator });

// Snapshot of the product at order time, so deleting or editing a product never changes old orders
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: [true, "Product is required"] },
    title: requiredText("Title", 150),
    image: requiredText("Image", 500),
    size: requiredText("Size", 20),
    color: requiredText("Color", 40),
    qty: { type: Number, required: [true, "Quantity is required"], min: [1, "Quantity must be at least 1"], validate: isInteger },
    // unit price actually charged (discountPrice if present, else price)
    price: { type: Number, required: [true, "Price is required"], min: [0.01, "Price must be greater than 0"], validate: moneyValidator },
  },
  { _id: false }
);

// Copy of the chosen address, not a reference: later profile edits must not change the order
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: requiredText("Full name", 100),
    phone: requiredText("Phone", 20),
    city: requiredText("City", 80),
    street: requiredText("Street", 200),
    postalCode: requiredText("Postal code", 20),
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
    items: {
      type: [orderItemSchema],
      validate: [
        { validator: (list) => list.length >= 1, message: "An order needs at least one item" },
        { validator: (list) => list.length <= MAX_ITEMS, message: `At most ${MAX_ITEMS} items are allowed` },
      ],
    },
    shippingAddress: { type: shippingAddressSchema, required: [true, "Shipping address is required"] },
    itemsPrice: money("Items price"),
    discountAmount: { ...money("Discount amount"), default: 0 },
    shippingPrice: money("Shipping price"),
    totalPrice: money("Total price"),
    couponCode: { type: String, uppercase: true, trim: true },
    paymentMethod: {
      type: String,
      enum: { values: PAYMENT_METHODS, message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}` },
      required: [true, "Payment method is required"],
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentIntentId: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: { values: ORDER_STATUSES, message: `Status must be one of: ${ORDER_STATUSES.join(", ")}` },
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

orderSchema.index({ user: 1, createdAt: -1 }); // GET /orders/my
orderSchema.index({ status: 1, createdAt: -1 }); // admin list and cleanup job

// The money fields never change after creation, so the arithmetic is checked once
// (in integer cents). This catches pricing bugs before a wrong total is stored.
orderSchema.pre("validate", function () {
  if (!this.isNew) return;

  const { itemsPrice, discountAmount, shippingPrice, totalPrice } = this;
  const numbers = [itemsPrice, discountAmount, shippingPrice, totalPrice];
  const itemsValid = this.items.every((i) => typeof i.price === "number" && typeof i.qty === "number");
  if (!itemsValid || numbers.some((n) => typeof n !== "number")) return; // required validators report these

  const linesCents = this.items.reduce((sum, item) => sum + toCents(item.price) * item.qty, 0);
  if (linesCents !== toCents(itemsPrice)) {
    this.invalidate("itemsPrice", "itemsPrice does not match the sum of the items");
  }
  if (toCents(discountAmount) > toCents(itemsPrice)) {
    this.invalidate("discountAmount", "discountAmount cannot exceed itemsPrice");
  }
  if (discountAmount > 0 && !this.couponCode) {
    this.invalidate("discountAmount", "discountAmount requires a couponCode");
  }
  const expectedTotal = toCents(itemsPrice) - toCents(discountAmount) + toCents(shippingPrice);
  if (expectedTotal !== toCents(totalPrice)) {
    this.invalidate("totalPrice", "totalPrice must equal itemsPrice - discountAmount + shippingPrice");
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;