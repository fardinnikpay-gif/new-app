import { z } from "zod";
import { isValidIdentifier } from "./identifier";

const MIN_PASSWORD_LENGTH = 8;

const identifier = z
  .string()
  .trim()
  .min(1, "Enter your email or phone number")
  .refine(isValidIdentifier, "Enter a valid email or phone number");

const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);

const confirmPassword = z.string().min(1, "Confirm your password");

const passwordsMatch = {
  check: (data) => data.password === data.confirmPassword,
  options: { message: "Passwords do not match", path: ["confirmPassword"] },
};

export const loginSchema = z.object({
  identifier,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(60, "Name is too long"),
    identifier,
    password: newPassword,
    confirmPassword,
  })
  .refine(passwordsMatch.check, passwordsMatch.options);

export const forgotSchema = z.object({
  email: z.string().trim().min(1, "Enter your email").email("Enter a valid email"),
});

export const resetSchema = z
  .object({ password: newPassword, confirmPassword })
  .refine(passwordsMatch.check, passwordsMatch.options);