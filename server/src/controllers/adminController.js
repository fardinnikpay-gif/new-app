import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as statsService from "../services/statsService.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDashboardStats();
  sendSuccess(res, 200, "Dashboard stats fetched", { stats });
});