import { z } from "zod";
import { cartItemSchema } from "./cartValidator.js";

const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"));

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  city: z.string().trim().min(1).max(60),
  street: z.string().trim().min(3).max(200),
  postalCode: z.string().trim().min(3).max(12),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty").max(50, "Too many items in cart"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "stripe"]),
  couponCode: z.string().trim().max(30).optional(),
});