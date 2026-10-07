import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as productService from "../services/productService.js";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  sendSuccess(res, 200, "Products fetched", result); // { products, total, pages, page }
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  sendSuccess(res, 200, "Product fetched", { product });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getRelatedProducts(req.params.slug);
  sendSuccess(res, 200, "Related products fetched", { products });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit);
  sendSuccess(res, 200, "Featured products fetched", { products });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await productService.getNewArrivals(req.query.limit);
  sendSuccess(res, 200, "New arrivals fetched", { products });
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await productService.getBrands();
  sendSuccess(res, 200, "Brands fetched", { brands });
});