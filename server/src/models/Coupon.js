import mongoose from "mongoose";
import { moneyValidator } from "../utils/money.js";

export const COUPON_TYPES = ["percent", "fixed"];

const isIntegerOrNull = { validator: (v) => v == null || Number.isInteger(v), message: "Must be an integer" };

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_-]{3,30}$/, "Code must be 3-30 characters: letters, digits, - or _"],
    },
    type: {
      type: String,
      enum: { values: COUPON_TYPES, message: `Type must be one of: ${COUPON_TYPES.join(", ")}` },
      required: [true, "Coupon type is required"],
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
      min: [0.01, "Value must be greater than 0"],
      validate: moneyValidator,
    },
    minOrder: { type: Number, default: 0, min: [0, "Minimum order cannot be negative"], validate: moneyValidator },
    // No maxUses = unlimited
    maxUses: { type: Number, min: [1, "maxUses must be at least 1"], validate: isIntegerOrNull },
    usedCount: { type: Number, default: 0, min: [0, "usedCount cannot be negative"], validate: isIntegerOrNull },
    // No expiresAt = never expires
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
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

couponSchema.pre("validate", function () {
  if (this.type === "percent" && this.value > 100) {
    this.invalidate("value", "Percent value cannot exceed 100");
  }
});

/**
 * Read-only check used for validation and preview. It is NOT a reservation:
 * step 19 must consume a use with an atomic conditional update.
 * `now` is a parameter only to make the method testable.
 */
couponSchema.methods.isValidFor = function (subtotal, now = new Date()) {
  if (!Number.isFinite(subtotal) || subtotal < 0) return { valid: false, reason: "Invalid order subtotal" };
  if (!this.isActive) return { valid: false, reason: "Coupon is not active" };
  if (this.expiresAt && this.expiresAt <= now) return { valid: false, reason: "Coupon has expired" };
  if (this.maxUses != null && this.usedCount >= this.maxUses) {
    return { valid: false, reason: "Coupon usage limit reached" };
  }
  if (subtotal < (this.minOrder ?? 0)) {
    return { valid: false, reason: `Minimum order amount is ${this.minOrder}` };
  }
  return { valid: true };
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;