import Product, { normalizeSize, normalizeColor } from "../models/Product.js";
import Category from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination } from "../utils/pagination.js";

// GET /products/:slug would never reach a product whose slug equals one of these.
// Step 15 must refuse them when generating slugs.
export const RESERVED_PRODUCT_SLUGS = ["featured", "new-arrivals", "brands"];

const DEFAULT_HOME_LIMIT = 8;
const RELATED_LIMIT = 8;
const LIST_PROJECTION = { description: 0 }; // cards do not need the long text

// _id is the tie-breaker: without it, equal values can repeat or vanish between pages
const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  price_asc: { finalPrice: 1, _id: 1 },
  price_desc: { finalPrice: -1, _id: 1 },
};

/**
 * Turns the (already validated) query into a Mongo query description.
 * query.category must already be a category id (see resolveCategoryId).
 * Returns { filter, sort, projection }.
 */
export const buildProductQuery = (query = {}) => {
  const { category, brand, size, color, minPrice, maxPrice, search, sort } = query;

  if (sort !== undefined && !Object.hasOwn(SORTS, sort)) {
    throw new ApiError(400, `sort must be one of: ${Object.keys(SORTS).join(", ")}`);
  }

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (brand?.length) filter.brand = { $in: brand };

  // size and color must match the SAME variant, and that variant must be in stock
  if (size?.length || color?.length) {
    const variant = { stock: { $gt: 0 } };
    if (size?.length) variant.size = { $in: size.map(normalizeSize) };
    if (color?.length) variant.color = { $in: color.map(normalizeColor) };
    filter.variants = { $elemMatch: variant };
  }

  // finalPrice = discountPrice ?? price, i.e. what the customer pays
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.finalPrice = {};
    if (minPrice !== undefined) filter.finalPrice.$gte = minPrice;
    if (maxPrice !== undefined) filter.finalPrice.$lte = maxPrice;
  }

  if (search) filter.$text = { $search: search };

  // A search without an explicit sort is ordered by relevance
  const byRelevance = Boolean(search) && sort === undefined;
  return {
    filter,
    sort: byRelevance ? { score: { $meta: "textScore" }, _id: -1 } : SORTS[sort ?? "newest"],
    projection: byRelevance ? { ...LIST_PROJECTION, score: { $meta: "textScore" } } : LIST_PROJECTION,
  };
};

// "men" -> its id (ids pass through). null means "no such category".
const resolveCategoryId = async (value) => {
  if (/^[a-f0-9]{24}$/i.test(value)) return value;
  const category = await Category.findOne({ name: value }).select("_id");
  return category?._id ?? null;
};

export const getProducts = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);

  let categoryId;
  if (query.category) {
    categoryId = await resolveCategoryId(query.category);
    if (!categoryId) return { products: [], total: 0, pages: 0, page };
  }

  const { filter, sort, projection } = buildProductQuery({ ...query, category: categoryId });
  const [products, total] = await Promise.all([
    Product.find(filter, projection).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { products, total, pages: Math.ceil(total / limit), page };
};

/** Public: inactive products are treated as not found. */
export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).populate("category", "name slug");
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const getRelatedProducts = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).select("category");
  if (!product) throw new ApiError(404, "Product not found");

  return Product.find(
    { category: product.category, isActive: true, _id: { $ne: product._id } },
    LIST_PROJECTION
  )
    .sort(SORTS.newest)
    .limit(RELATED_LIMIT);
};

export const getFeaturedProducts = async (limit = DEFAULT_HOME_LIMIT) =>
  Product.find({ isActive: true, isFeatured: true }, LIST_PROJECTION).sort(SORTS.newest).limit(limit);

export const getNewArrivals = async (limit = DEFAULT_HOME_LIMIT) =>
  Product.find({ isActive: true }, LIST_PROJECTION).sort(SORTS.newest).limit(limit);

export const getBrands = async () => {
  const brands = await Product.distinct("brand", { isActive: true });
  return brands.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
};