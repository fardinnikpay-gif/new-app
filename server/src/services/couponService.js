import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "./emailService.js";
import { couponEmail } from "../utils/emailTemplates.js";

const EMAIL_BATCH_SIZE = 10;

const round2 = (n) => Math.round(n * 100) / 100;

const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const assertPercentRange = (type, value) => {
  if (type === "percent" && value > 100) {
    throw new ApiError(400, "Percent value cannot be more than 100");
  }
};

const getByIdOrThrow = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new ApiError(404, "Coupon not found");
  return coupon;
};

// Customers must never see usedCount / maxUses / isActive
const toPublicCoupon = (coupon) => ({
  code: coupon.code,
  type: coupon.type,
  value: coupon.value,
  minOrder: coupon.minOrder,
  expiresAt: coupon.expiresAt,
});

export const calculateDiscount = (coupon, subtotal) => {
  const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  return round2(Math.min(raw, subtotal));
};

export const findByCode = (code) =>
  Coupon.findOne({ code: String(code).trim().toUpperCase() });

// Shared with pricingService (step 18) and orderService (step 19)
export const getValidCoupon = async (code, subtotal) => {
  const coupon = await findByCode(code);
  if (!coupon) throw new ApiError(404, "Coupon not found");

  const { valid, reason } = coupon.isValidFor(subtotal);
  if (!valid) throw new ApiError(400, reason || "Coupon is not valid");
  return coupon;
};

export const validateCoupon = async (code, subtotal) => {
  const coupon = await getValidCoupon(code, subtotal);
  return {
    discountAmount: calculateDiscount(coupon, subtotal),
    coupon: toPublicCoupon(coupon),
  };
};

export const createCoupon = async (data) => {
  if (await Coupon.exists({ code: data.code })) {
    throw new ApiError(409, "A coupon with this code already exists");
  }
  return Coupon.create({ ...data, isActive: data.isActive ?? true });
};

export const getCoupons = () => Coupon.find().sort({ createdAt: -1 });

export const updateCoupon = async (id, data) => {
  const coupon = await getByIdOrThrow(id);
  const fields = pickDefined(data);

  if (fields.code && fields.code !== coupon.code && (await Coupon.exists({ code: fields.code }))) {
    throw new ApiError(409, "A coupon with this code already exists");
  }

  coupon.set(fields);
  assertPercentRange(coupon.type, coupon.value); // merged check (type and value may come from different sources)
  await coupon.save();
  return coupon;
};

export const deleteCoupon = async (id) => {
  const coupon = await getByIdOrThrow(id);
  // Old orders keep couponCode as a plain string snapshot, so deleting is safe
  await coupon.deleteOne();
};

export const sendCouponByEmail = async (id, emails) => {
  const coupon = await getByIdOrThrow(id);

  // Pass minOrder as subtotal so only active / expiry / usage limit are checked
  const { valid, reason } = coupon.isValidFor(coupon.minOrder ?? 0);
  if (!valid) throw new ApiError(400, `Cannot send this coupon: ${reason}`);

  const recipients = [...new Set(emails)];
  const { subject, html } = couponEmail(coupon);

  for (let i = 0; i < recipients.length; i += EMAIL_BATCH_SIZE) {
    const batch = recipients.slice(i, i + EMAIL_BATCH_SIZE);
    await Promise.all(batch.map((to) => sendEmail({ to, subject, html })));
  }
  return { sent: recipients.length };
};

// Atomic check + increment in ONE query, so two simultaneous orders can never exceed maxUses
export const claimUse = async (code) => {
  const result = await Coupon.updateOne(
    {
      code,
      isActive: true,
      expiresAt: { $gt: new Date() },
      $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }], // maxUses null = unlimited
    },
    { $inc: { usedCount: 1 } }
  );
  if (result.modifiedCount !== 1) {
    throw new ApiError(400, "Coupon is no longer available");
  }
};

// Used for rollback only; never throws so it cannot hide the original error
export const releaseUse = async (code) => {
  try {
    await Coupon.updateOne({ code, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
  } catch (error) {
    console.error(`COUPON RELEASE FAILED code=${code}:`, error.message);
  }
};