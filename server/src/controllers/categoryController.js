import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as categoryService from "../services/categoryService.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listAll();
  sendSuccess(res, 200, "Categories fetched", { categories });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateImage(req.params.id, req.file);
  sendSuccess(res, 200, "Category updated", { category });
});