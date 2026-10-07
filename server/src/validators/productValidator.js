import { z } from "zod";

// multipart/form-data sends everything as strings, so JSON and booleans need manual parsing
const parseJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value; // let Zod report the type error
  }
};

const toBoolean = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const emptyToNull = (value) => (value === "" || value === "null" ? null : value);

const hasUniqueVariants = (variants) =>
  new Set(variants.map((v) => `${v.size}|${v.color}`)).size === variants.length;

const variantSchema = z.object({
  size: z.string().trim().min(1, "Size is required").max(20).transform((s) => s.toUpperCase()),
  color: z.string().trim().min(1, "Color is required").max(30).transform((c) => c.toLowerCase()),
  stock: z.coerce.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
});

const variantsSchema = z.preprocess(
  parseJson,
  z
    .array(variantSchema)
    .min(1, "At least one variant is required")
    .refine(hasUniqueVariants, "Duplicate size/color combination")
);

const productShape = {
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  brand: z.string().trim().min(1).max(60),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()).optional(),
  variants: variantsSchema,
  isActive: z.preprocess(toBoolean, z.boolean()).optional(),
  isFeatured: z.preprocess(toBoolean, z.boolean()).optional(),
};

const discountBelowPrice = (data) =>
  data.discountPrice == null || data.price == null || data.discountPrice < data.price;

const discountRule = {
  message: "Discount price must be less than price",
  path: ["discountPrice"],
};

export const createProductSchema = z
  .object(productShape)
  .refine(discountBelowPrice, discountRule);

export const updateProductSchema = z
  .object(productShape)
  .partial()
  .extend({
    removedImages: z.preprocess(parseJson, z.array(z.string().min(1))).optional(),
  })
  .refine(discountBelowPrice, discountRule);