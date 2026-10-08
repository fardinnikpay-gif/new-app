import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as pricingService from "../services/pricingService.js";

export const previewCart = asyncHandler(async (req, res) => {
  const pricing = await pricingService.calculateOrderPricing(req.body);
  sendSuccess(res, 200, "Cart priced", { pricing });
});