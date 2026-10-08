import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderService from "../services/orderService.js";
import * as orderQueryService from "../services/orderQueryService.js";
import * as orderStatusService from "../services/orderStatusService.js";

export const createOrder = asyncHandler(async (req, res) => {
  // userId comes last so the request body can never override it
  const order = await orderService.createOrder({ ...req.body, userId: req.user._id });
  sendSuccess(res, 201, "Order created", { order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, pages } = await orderQueryService.getMyOrders(req.user._id, req.query);
  sendSuccess(res, 200, "Orders fetched", { orders, pages });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderQueryService.getOrderById(req.params.id, req.user);
  sendSuccess(res, 200, "Order fetched", { order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderStatusService.cancelOrder(req.params.id, req.user._id);
  sendSuccess(res, 200, "Order cancelled", { order });
});