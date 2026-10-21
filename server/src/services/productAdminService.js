import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { makeSlug } from "../utils/slugify.js";
import * as uploadService from "./uploadService.js";

const MAX_IMAGES = 6;

const getByIdOrThrow = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const assertCategoryExists = async (categoryId) => {
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) throw new ApiError(400, "Category not found");
};

const assertDiscount = (price, discountPrice) => {
  if (discountPrice != null && discountPrice >= price) {
    throw new ApiError(400, "Discount price must be less than price");
  }
};

const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

// Best-effort cleanup: a failed Cloudinary delete must never break the request
const discardImages = async (publicIds) => {
  const results = await Promise.allSettled(publicIds.map(uploadService.deleteImage));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Failed to delete image ${publicIds[i]}:`, r.reason?.message);
    }
  });
};

export const createProduct = async (data, files = []) => {
  if (files.length === 0) throw new ApiError(400, "At least one image is required");

  const slug = makeSlug(data.title);
  if (!slug) throw new ApiError(400, "Title must contain letters or numbers");
  if (await Product.exists({ slug })) {
    throw new ApiError(409, "A product with this title already exists");
  }
  await assertCategoryExists(data.category);

  const images = await uploadService.uploadImages(files);
  try {
    const product = await Product.create({
      ...data,
      slug,
      images,
      discountPrice: data.discountPrice ?? undefined,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
    });
    return await product.populate("category", "name slug");
  } catch (error) {
    await discardImages(images.map((img) => img.publicId));
    throw error;
  }
};

export const updateProduct = async (id, data, files = []) => {
  const product = await getByIdOrThrow(id);
  const { removedImages = [], ...rawFields } = data;
  const fields = pickDefined(rawFields);

  const removeIds = new Set(removedImages);
  const toRemove = product.images.filter((img) => removeIds.has(img.publicId));
  if (toRemove.length !== removeIds.size) {
    throw new ApiError(400, "Some images to remove do not belong to this product");
  }

  const kept = product.images.filter((img) => !removeIds.has(img.publicId));
  const finalCount = kept.length + files.length;
  if (finalCount < 1) throw new ApiError(400, "A product needs at least one image");
  if (finalCount > MAX_IMAGES) {
    throw new ApiError(400, `A product can have at most ${MAX_IMAGES} images`);
  }

  if (fields.category) await assertCategoryExists(fields.category);
  const nextDiscount =
    fields.discountPrice === undefined ? product.discountPrice : fields.discountPrice;
  assertDiscount(fields.price ?? product.price, nextDiscount);

  // Slug is intentionally kept stable on title change to protect existing URLs (SEO)
  const newImages = files.length ? await uploadService.uploadImages(files) : [];
  try {
    product.set(fields);
    product.images = [...kept, ...newImages];
    await product.save();
  } catch (error) {
    await discardImages(newImages.map((img) => img.publicId));
    throw error;
  }

  await discardImages(toRemove.map((img) => img.publicId));
  return await product.populate("category", "name slug");
};

export const deleteProduct = async (id) => {
  const product = await getByIdOrThrow(id);
  await product.deleteOne();
  // Old orders keep their own snapshot; only wishlists hold live references
  await User.updateMany({ wishlist: product._id }, { $pull: { wishlist: product._id } });
  await discardImages(product.images.map((img) => img.publicId));
};

export const toggleActive = async (id) => {
  const product = await getByIdOrThrow(id);
  product.isActive = !product.isActive;
  await product.save();
  return product;
};


export const getAdminProducts = async (query = {}) => {
  const { getPagination } = await import("../utils/pagination.js");
  const { page, limit, skip } = getPagination(query);

  const filter = {};

  if (query.search?.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  if (query.isActive === "true") filter.isActive = true;
  if (query.isActive === "false") filter.isActive = false;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
};

export const getAdminProduct = async (id) => {
  const product = await Product.findById(id).populate("category", "name slug");

  if (!product) throw new ApiError(404, "Product not found");

  return product;
};