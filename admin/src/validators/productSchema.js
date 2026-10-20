import { z } from "zod";
import { CATEGORIES, PRODUCT_LIMITS } from "../utils/constants";

// Form values are strings; they are converted to numbers when the FormData is built.
const isNumeric = (value) => value !== "" && Number.isFinite(Number(value));

const requiredText = (label, max) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);

const variantSchema = z.object({
  size: requiredText("Size", PRODUCT_LIMITS.variantText),
  color: requiredText("Color", PRODUCT_LIMITS.variantText),
  stock: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value), "Stock must be a whole number, 0 or more"),
});

export const productSchema = z
  .object({
    title: requiredText("Title", PRODUCT_LIMITS.title),
    description: requiredText("Description", PRODUCT_LIMITS.description),
    brand: requiredText("Brand", PRODUCT_LIMITS.brand),
    category: z.string().refine((value) => CATEGORIES.includes(value), "Select a category"),
    price: z
      .string()
      .trim()
      .min(1, "Price is required")
      .refine((value) => isNumeric(value) && Number(value) > 0, "Price must be greater than 0"),
    discountPrice: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (isNumeric(value) && Number(value) > 0),
        "Discount price must be greater than 0"
      ),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    variants: z.array(variantSchema).min(1, "Add at least one variant"),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountPrice !== "" &&
      isNumeric(data.price) &&
      isNumeric(data.discountPrice) &&
      Number(data.discountPrice) >= Number(data.price)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "Discount price must be lower than the price",
      });
    }

    // No two variants with the same size and color (case-insensitive).
    const seen = new Set();
    data.variants.forEach((variant, index) => {
      const key = `${variant.size.toLowerCase()}|${variant.color.toLowerCase()}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", index, "color"],
          message: "This size and color combination already exists",
        });
      }
      seen.add(key);
    });
  });