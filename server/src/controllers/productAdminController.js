import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as productAdminService from "../services/productAdminService.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productAdminService.createProduct(req.body, req.files);
  sendSuccess(res, 201, "Product created", { product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productAdminService.updateProduct(req.params.id, req.body, req.files);
  sendSuccess(res, 200, "Product updated", { product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productAdminService.deleteProduct(req.params.id);
  sendSuccess(res, 200, "Product deleted", {});
});

export const toggleActive = asyncHandler(async (req, res) => {
  const product = await productAdminService.toggleActive(req.params.id);
  sendSuccess(res, 200, "Product status updated", { product });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const result = await productAdminService.getAdminProducts(req.query);
  sendSuccess(res, 200, "Admin products fetched", result);
});

export const getAdminProduct = asyncHandler(async (req, res) => {
  const product = await productAdminService.getAdminProduct(req.params.id);
  sendSuccess(res, 200, "Admin product fetched", { product });
});