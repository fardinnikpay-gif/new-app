import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderQueryService from "../services/orderQueryService.js";
import * as orderStatusService from "../services/orderStatusService.js";

export const getAllOrders = asyncHandler(async (req, res) => {
  const { orders, total, pages } = await orderQueryService.getAllOrders(req.query);
  sendSuccess(res, 200, "Orders fetched", { orders, total, pages });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderStatusService.updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, 200, "Order status updated", { order });
});

export const markAsPaid = asyncHandler(async (req, res) => {
  const order = await orderStatusService.markAsPaid(req.params.id);
  sendSuccess(res, 200, "Order marked as paid", { order });
});