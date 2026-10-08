import { z } from "zod";

export const createIntentSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order id"),
});