import { z } from "zod";
import { COUPON_LIMITS, COUPON_TYPES } from "../utils/constants";
import { getTodayInputValue, isValidDateInput } from "../utils/coupon";

const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;
const { codeMin, codeMax, percentMin, percentMax } = COUPON_LIMITS;

const isNumeric = (value) => value !== "" && Number.isFinite(Number(value));

// Form values are strings; they are converted when the payload is built.
// takenCodes: uppercase codes of OTHER coupons (quick feedback; the server stays the authority).
// Past expiry dates are only rejected when creating, so an expired coupon can still be edited.
export const getCouponSchema = ({ isEdit = false, takenCodes = [] } = {}) =>
  z
    .object({
      code: z
        .string()
        .trim()
        .min(codeMin, `Code must be at least ${codeMin} characters`)
        .max(codeMax, `Code must be at most ${codeMax} characters`)
        .regex(CODE_PATTERN, "Use only letters, numbers, - and _")
        .refine(
          (value) => !takenCodes.includes(value.toUpperCase()),
          "This code is already used by another coupon"
        ),
      type: z.string().refine((value) => COUPON_TYPES.includes(value), "Select a type"),
      value: z
        .string()
        .trim()
        .refine((value) => isNumeric(value) && Number(value) > 0, "Value must be greater than 0"),
      minOrder: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || (isNumeric(value) && Number(value) >= 0),
          "Minimum order must be 0 or more"
        ),
      maxUses: z
        .string()
        .trim()
        .refine(
          (value) => /^\d+$/.test(value) && Number(value) >= 1,
          "Max uses must be a whole number, 1 or more"
        ),
      expiresAt: z
        .string()
        .refine(isValidDateInput, "Choose an expiry date")
        .refine(
          (value) => isEdit || value >= getTodayInputValue(),
          "Expiry date cannot be in the past"
        ),
      isActive: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.type !== "percent" || !isNumeric(data.value)) return;
      const percent = Number(data.value);
      if (percent < percentMin || percent > percentMax) {
        ctx.addIssue({
          code: "custom",
          path: ["value"],
          message: `Percentage must be between ${percentMin} and ${percentMax}`,
        });
      }
    });