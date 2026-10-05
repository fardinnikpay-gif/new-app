
import { z } from "zod";
import {
  nameSchema,
  phoneSchema,
  passwordSchema,
} from "./authValidator.js";

// Make a schema optional
const optional = (schema) => schema.optional();

// Convert Persian and Arabic digits to ASCII digits
const toAsciiDigits = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
};

export const updateProfileSchema = z
  .object({
    name: optional(nameSchema),
    phone: optional(phoneSchema),
  })
  .refine(
    (data) => data.name !== undefined || data.phone !== undefined,
    {
      message: "Provide name or phone",
      path: ["name"],
    }
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(128),

    newPassword: passwordSchema,
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from the current password",
      path: ["newPassword"],
    }
  );

const addressFields = {
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100),

  phone: phoneSchema,

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(80),

  street: z
    .string()
    .trim()
    .min(3, "Street must be at least 3 characters")
    .max(200),

  postalCode: z
    .string()
    .trim()
    .transform(toAsciiDigits)
    .pipe(
      z
        .string()
        .regex(
          /^[A-Za-z0-9][A-Za-z0-9 -]{1,18}[A-Za-z0-9]$/,
          "Invalid postal code"
        )
    ),

  isDefault: z.boolean().optional(),
};

export const createAddressSchema = z.object(addressFields);

export const updateAddressSchema = z
  .object(addressFields)
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update",
    }
  );
