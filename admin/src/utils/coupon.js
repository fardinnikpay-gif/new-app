import { formatPrice } from "./format";

const END_OF_DAY = [23, 59, 59, 999];
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const pad = (number) => String(number).padStart(2, "0");

// Local calendar date as "YYYY-MM-DD" (the value format of <input type="date">).
export const toDateInputValue = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getTodayInputValue = () => toDateInputValue(new Date());

export const isValidDateInput = (value) => {
  if (!DATE_INPUT_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
};

// A coupon is valid through the END of the chosen day (local time).
// Building the date from parts avoids the UTC shift of new Date("YYYY-MM-DD").
export const toExpiryIso = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, ...END_OF_DAY).toISOString();
};

export const isExpired = (iso, now = Date.now()) => {
  const time = new Date(iso).getTime();
  return Number.isFinite(time) && time < now;
};

export const formatDiscount = (coupon) =>
  coupon.type === "percent" ? `${Number(coupon.value)}%` : formatPrice(coupon.value);

// Form values are strings (see productForm.js for the same approach).
export const toCouponFormValues = (coupon) => ({
  code: coupon?.code ?? "",
  type: coupon?.type ?? "percent",
  value: coupon ? String(coupon.value ?? "") : "",
  minOrder: coupon && Number(coupon.minOrder) > 0 ? String(coupon.minOrder) : "",
  maxUses: coupon ? String(coupon.maxUses ?? "") : "",
  expiresAt: toDateInputValue(coupon?.expiresAt),
  isActive: coupon?.isActive ?? true,
});

export const buildCouponPayload = (values) => ({
  code: values.code.trim().toUpperCase(),
  type: values.type,
  value: Number(values.value),
  minOrder: values.minOrder === "" ? 0 : Number(values.minOrder),
  maxUses: Number(values.maxUses),
  expiresAt: toExpiryIso(values.expiresAt),
  isActive: values.isActive,
});

// POST /coupons/:id/send returns { sent }: a count (or a list). Falls back to what we sent.
export const toSentCount = (sent, fallback) => {
  if (Array.isArray(sent)) return sent.length;
  return Number.isFinite(Number(sent)) ? Number(sent) : fallback;
};