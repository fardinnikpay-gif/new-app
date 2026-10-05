import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";
import { signToken, setAuthCookie } from "../utils/token.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess(res, 200, "Profile updated", { user });
});

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  // Older tokens are now invalid, so keep this device signed in with a fresh one
  setAuthCookie(res, signToken(req.user.id));
  sendSuccess(res, 200, "Password changed successfully");
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.addAddress(req.user.id, req.body);
  sendSuccess(res, 201, "Address added", { addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.updateAddress(req.user.id, req.params.id, req.body);
  sendSuccess(res, 200, "Address updated", { addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.deleteAddress(req.user.id, req.params.id);
  sendSuccess(res, 200, "Address deleted", { addresses });
});