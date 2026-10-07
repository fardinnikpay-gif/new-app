import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as wishlistService from "../services/wishlistService.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const products = await wishlistService.getWishlist(req.user._id);
  sendSuccess(res, 200, "Wishlist fetched", { products });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { added } = await wishlistService.toggleWishlist(req.user._id, req.params.productId);
  sendSuccess(res, 200, added ? "Added to wishlist" : "Removed from wishlist", { added });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  await wishlistService.clearWishlist(req.user._id);
  sendSuccess(res, 200, "Wishlist cleared", {});
});