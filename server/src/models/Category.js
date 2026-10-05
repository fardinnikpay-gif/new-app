import mongoose from "mongoose";
import imageSchema from "./imageSchema.js";
import { makeSlug } from "../utils/slugify.js";

export const CATEGORY_NAMES = ["men", "women", "kids"];

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: { values: CATEGORY_NAMES, message: `Category must be one of: ${CATEGORY_NAMES.join(", ")}` },
      required: [true, "Category name is required"],
      unique: true,
    },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: imageSchema, default: undefined },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Default the slug from the name (men, women, kids)
categorySchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = makeSlug(this.name);
});

const Category = mongoose.model("Category", categorySchema);

export default Category;