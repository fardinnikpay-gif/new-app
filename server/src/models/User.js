import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+[1-9]\d{6,14}$/; // E.164, normalized by the Zod schema (step 9)
const BCRYPT_ROUNDS = config.isTest ? 4 : 12; // low cost only to keep tests fast
export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
export const MAX_ADDRESSES = 5;

// A sparse unique index still indexes null and "", so empty input must become
// "field missing" or two phone-only users would collide on email.
const emptyToUndefined = (value) => {
  if (value == null) return undefined;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Full name is required"], trim: true, maxlength: 100 },
  phone: { type: String, required: [true, "Phone is required"], trim: true, maxlength: 20 },
  city: { type: String, required: [true, "City is required"], trim: true, maxlength: 80 },
  street: { type: String, required: [true, "Street is required"], trim: true, maxlength: 200 },
  postalCode: { type: String, required: [true, "Postal code is required"], trim: true, maxlength: 20 },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [EMAIL_REGEX, "Invalid email address"],
      set: emptyToUndefined,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [PHONE_REGEX, "Invalid phone number (use international format, e.g. +989121234567)"],
      set: emptyToUndefined,
    },
    password: { type: String, required: [true, "Password is required"], select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: {
      type: [addressSchema],
      validate: [(list) => list.length <= MAX_ADDRESSES, `At most ${MAX_ADDRESSES} addresses are allowed`],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    // Set when an existing user changes password: older JWTs are rejected by protect
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.passwordChangedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// At least one of email / phone is required
userSchema.pre("validate", function () {
  if (!this.isNew && !this.isModified("email") && !this.isModified("phone")) return;
  if (!this.email && !this.phone) this.invalidate("email", "Either email or phone is required");
});

// Hash the password only when it changed
// Hash the password only when it changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
  if (!this.isNew) this.passwordChangedAt = new Date();
});
/** Same hashing for creating and looking up reset tokens (used in step 12). */
userSchema.statics.hashResetToken = (rawToken) =>
  crypto.createHash("sha256").update(String(rawToken)).digest("hex");

userSchema.methods.comparePassword = async function (plain) {
  if (!this.password) {
    throw new Error("Password not loaded: query the user with .select('+password')");
  }
  return bcrypt.compare(String(plain ?? ""), this.password);
};

/** Sets the hashed token + expiry on the document (caller saves) and returns the raw token. */
userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = this.constructor.hashResetToken(rawToken);
  this.resetPasswordExpire = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return rawToken;
};

const User = mongoose.model("User", userSchema);

export default User;