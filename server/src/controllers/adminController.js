import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as statsService from "../services/statsService.js";
import * as userAdminService from "../services/userAdminService.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDashboardStats();
  sendSuccess(res, 200, "Dashboard stats fetched", { stats });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { users, total, pages } = await userAdminService.getUsers(req.query);
  sendSuccess(res, 200, "Users fetched", { users, total, pages });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { user, ordersCount } = await userAdminService.getUserById(req.params.id);
  sendSuccess(res, 200, "User fetched", { user, ordersCount });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userAdminService.deleteUser(req.params.id, req.user._id);
  sendSuccess(res, 200, "User deleted", {});
});