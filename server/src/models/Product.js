import mongoose from "mongoose";
import imageSchema from "./imageSchema.js";
import { moneyValidator } from "../utils/money.js";

const MAX_IMAGES = 6;
const MAX_VARIANTS = 100;

// Variants are stored in one canonical form (size UPPERCASE, color lowercase) so
// exact-match queries (stock decrement in step 19) and isPurchasable agree.
// Services must pass incoming size/color through these helpers.
export const normalizeSize = (value) => String(value ?? "").trim().toUpperCase();
export const normalizeColor = (value) => String(value ?? "").trim().toLowerCase();


const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: [true, "Size is required"], set: normalizeSize, maxlength: 20 },
    color: { type: String, required: [true, "Color is required"], set: normalizeColor, maxlength: 40 },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: { validator: Number.isInteger, message: "Stock must be an integer" },
    },
  },
  { _id: false }
);

const hasUniqueVariants = (variants) =>
  new Set(variants.map((v) => `${v.size}|${v.color}`)).size === variants.length;

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, minlength: 2, maxlength: 150 },
    slug: { type: String, required: [true, "Slug is required"], unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true, maxlength: 5000 },
    brand: { type: String, required: [true, "Brand is required"], trim: true, maxlength: 80 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: [true, "Category is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
      validate: moneyValidator,
    },
    discountPrice: {
      type: Number,
      min: [0.01, "Discount price must be greater than 0"],
      validate: moneyValidator,
    },
    images: {
      type: [imageSchema],
      validate: [
        { validator: (list) => list.length >= 1, message: "At least one image is required" },
        { validator: (list) => list.length <= MAX_IMAGES, message: `At most ${MAX_IMAGES} images are allowed` },
      ],
    },
    variants: {
      type: [variantSchema],
      validate: [
        { validator: (list) => list.length >= 1, message: "At least one variant is required" },
        { validator: (list) => list.length <= MAX_VARIANTS, message: `At most ${MAX_VARIANTS} variants are allowed` },
        { validator: hasUniqueVariants, message: "Each size/color combination must be unique" },
      ],
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text search: "none" language = plain tokenization, so Persian titles work too
productSchema.index(
  { title: "text", brand: "text", description: "text" },
  { weights: { title: 10, brand: 5, description: 1 }, default_language: "none", name: "product_text" }
);
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Runs on doc.save()/validate() only: update flows must load the doc and save it
productSchema.pre("validate", function () {
  if (this.discountPrice != null && this.price != null && this.discountPrice >= this.price) {
    this.invalidate("discountPrice", "Discount price must be less than price");
  }
});

productSchema.virtual("totalStock").get(function () {
  return (this.variants ?? []).reduce((sum, variant) => sum + variant.stock, 0);
});

/**
 * Read-only check (cart preview). Not a reservation: the real stock decrement
 * in step 19 is a conditional atomic update.
 */
productSchema.methods.isPurchasable = function (size, color, qty) {
  if (!this.isActive) return false;
  if (!Number.isInteger(qty) || qty < 1) return false;

  const wantedSize = normalizeSize(size);
  const wantedColor = normalizeColor(color);
  const variant = this.variants.find((v) => v.size === wantedSize && v.color === wantedColor);
  return Boolean(variant && variant.stock >= qty);
};

const Product = mongoose.model("Product", productSchema);

export default Product;