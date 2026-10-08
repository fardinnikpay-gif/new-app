import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid product id")
    .transform((id) => id.toLowerCase()),
  // Same normalization as product variants (step 15), so lookups match exactly
  size: z.string().trim().min(1).max(20).transform((s) => s.toUpperCase()),
  color: z.string().trim().min(1).max(30).transform((c) => c.toLowerCase()),
  qty: z.coerce.number().int("Quantity must be an integer").min(1).max(20),
});

export const previewCartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty").max(50, "Too many items in cart"),
  couponCode: z.string().trim().max(30).optional(),
});