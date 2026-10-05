/** At most 2 decimals (null/undefined pass: use `required` to enforce presence). */
export const isMoney = (value) =>
  value == null || (Number.isFinite(value) && Math.abs(value * 100 - Math.round(value * 100)) < 1e-6);

/** Mongoose validator object for money fields. */
export const moneyValidator = {
  validator: isMoney,
  message: "Must be a valid amount with at most 2 decimals",
};

/** Do all price math in integer cents to avoid float errors (19.99 * 3). */
export const toCents = (amount) => Math.round(amount * 100);
export const fromCents = (cents) => cents / 100;