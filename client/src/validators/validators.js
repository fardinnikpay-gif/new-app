import { z } from "zod";
import { isValidPhone } from "../utils/identifier";

const MIN_PASSWORD_LENGTH = 8;

const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);

const confirmPassword = z.string().min(1, "Confirm your password");

// Phone is required when the account has no email (it's the only way to log in).
export const makeProfileSchema = (requirePhone) =>
  z.object({
    name: z.string().trim().min(2, "Enter your name").max(60, "Name is too long"),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => (value === "" ? !requirePhone : isValidPhone(value)),
        requirePhone ? "Enter a valid phone number" : "Enter a valid phone number or leave it empty"
      ),
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword,
    confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });
