import { z } from "zod";

const PHONE_REGEX = /^\+[1-9]\d{6,14}$/; // E.164; keep in sync with the User model
const MAX_PASSWORD_BYTES = 72; // bcrypt silently ignores everything after 72 bytes

// Empty strings from forms mean "not provided"
const emptyToUndefined = (value) => (typeof value === "string" && value.trim() === "" ? undefined : value);
const optional = (schema) => z.preprocess(emptyToUndefined, schema.optional());

// Persian (۰-۹) and Arabic-Indic (٠-٩) digits -> ASCII digits
const toAsciiDigits = (text) =>
  text
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** "+98 (912) 123-4567" or "۰۰۹۸۹۱۲۱۲۳۴۵۶۷" -> "+989121234567" */
export const normalizePhone = (value) => {
  const compact = toAsciiDigits(value).replace(/[\s\-().\u200c\u200e\u200f]/g, "");
  return compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
};

export const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(60);

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Invalid email address").max(254));

export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .pipe(z.string().regex(PHONE_REGEX, "Invalid phone number (use international format, e.g. +989121234567)"));

// Never trimmed: spaces are part of a password
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((value) => Buffer.byteLength(value, "utf8") <= MAX_PASSWORD_BYTES, {
    message: `Password is too long (max ${MAX_PASSWORD_BYTES} bytes; non-Latin characters take 2 bytes each)`,
  });

export const registerSchema = z
  .object({
    name: nameSchema,
    email: optional(emailSchema),
    phone: optional(phoneSchema),
    password: passwordSchema,
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or phone is required")
    .max(254)
    .transform((value) => (value.includes("@") ? value.toLowerCase() : normalizePhone(value))),
  password: z.string().min(1, "Password is required").max(128),
});
