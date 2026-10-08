import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderService from "../services/orderService.js";

export const createOrder = asyncHandler(async (req, res) => {
  // userId comes last so the request body can never override it
  const order = await orderService.createOrder({ ...req.body, userId: req.user._id });
  sendSuccess(res, 201, "Order created", { order });
});