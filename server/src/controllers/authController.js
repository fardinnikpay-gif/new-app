import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordWithToken,
} from "../services/authService.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  setAuthCookie(res, signToken(user._id)); // registering also signs the user in
  sendSuccess(res, 201, "Registered successfully", { user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  setAuthCookie(res, token); // the token only travels in the httpOnly cookie, never in the body
  sendSuccess(res, 200, "Logged in successfully", { user });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, 200, "Logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "OK", { user: req.user });
});

const FORGOT_PASSWORD_MESSAGE = "If an account with that email exists, a password reset link has been sent";

export const forgotPassword = asyncHandler(async (req, res) => {
  await requestPasswordReset(req.body.email);
  sendSuccess(res, 200, FORGOT_PASSWORD_MESSAGE); // identical for existing and unknown emails
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { user, token } = await resetPasswordWithToken(req.params.token, req.body.password);
  setAuthCookie(res, token); // signs the user in again
  sendSuccess(res, 200, "Password reset successfully", { user });
});