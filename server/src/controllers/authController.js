import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { registerUser, loginUser } from "../services/authService.js";
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