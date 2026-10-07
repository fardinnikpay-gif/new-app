import { z } from "zod";
import { CATEGORY_NAMES } from "../models/Category.js";
import { optional } from "./authValidator.js";

const OBJECT_ID = /^[a-f0-9]{24}$/i;
export const SORT_OPTIONS = ["newest", "price_asc", "price_desc"];

// ?size=M,L  or  ?size=M&size=L  ->  ["M", "L"]
const stringList = z
  .union([z.string(), z.array(z.string()).max(20)])
  .transform((value) =>
    (Array.isArray(value) ? value : [value])
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean)
  )
  .pipe(z.array(z.string().max(60)).max(20));

const price = optional(z.coerce.number().min(0).max(10_000_000));

export const productQuerySchema = z
  .object({
    page: optional(z.coerce.number().int().min(1)),
    limit: optional(z.coerce.number().int().min(1)),
    category: optional(
      z
        .string()
        .refine((value) => CATEGORY_NAMES.includes(value) || OBJECT_ID.test(value), {
          message: `category must be one of ${CATEGORY_NAMES.join(", ")} or a category id`,
        })
    ),
    brand: optional(stringList),
    size: optional(stringList),
    color: optional(stringList),
    minPrice: price,
    maxPrice: price,
    sort: optional(z.enum(SORT_OPTIONS, { message: `sort must be one of: ${SORT_OPTIONS.join(", ")}` })),
    search: optional(z.string().trim().min(1).max(100)),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: "minPrice cannot be greater than maxPrice",
    path: ["minPrice"],
  });

/** For /featured and /new-arrivals */
export const homeListQuerySchema = z.object({
  limit: optional(z.coerce.number().int().min(1).max(24)),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().toLowerCase().min(1).max(200),
});