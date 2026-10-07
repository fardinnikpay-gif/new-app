import { z } from "zod";

const couponShape = {
  code: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, "Code can only contain letters, numbers, - and _")
    .transform((code) => code.toUpperCase()),
  type: z.enum(["percent", "fixed"]),
  value: z.coerce.number().positive("Value must be greater than 0"),
  minOrder: z.coerce.number().min(0).optional(),
  maxUses: z.coerce.number().int().min(1).nullable().optional(), // null = unlimited
  expiresAt: z.coerce.date(),
  isActive: z.boolean().optional(),
};

// Only checks when both fields are present; the service re-checks the merged values on update
const percentWithinRange = (data) =>
  data.type !== "percent" || data.value === undefined || data.value <= 100;

const percentRule = {
  message: "Percent value cannot be more than 100",
  path: ["value"],
};

export const createCouponSchema = z
  .object(couponShape)
  .refine(percentWithinRange, percentRule)
  .refine((data) => data.expiresAt > new Date(), {
    message: "Expiry date must be in the future",
    path: ["expiresAt"],
  });

export const updateCouponSchema = z
  .object(couponShape)
  .partial()
  .refine(percentWithinRange, percentRule);

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1).max(30),
  subtotal: z.coerce.number().positive("Subtotal must be greater than 0"),
});

export const sendCouponSchema = z.object({
  emails: z
    .array(z.string().trim().toLowerCase().email("Invalid email address"))
    .min(1, "At least one email is required")
    .max(50, "You can send to at most 50 emails at once"),
});