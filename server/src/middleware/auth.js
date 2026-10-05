import mongoose from "mongoose";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AUTH_COOKIE_NAME, verifyToken } from "../utils/token.js";
import { config } from "../config/env.js";

const UNAUTHENTICATED = "Authentication required";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// CSRF defense for cookie auth: browsers always send Origin on cross-site writes,
// so a write from an origin that is not ours is rejected (needed once the cookie
// is SameSite=None in production). Requests without Origin (curl, tests) pass.
const assertTrustedOrigin = (req) => {
  if (SAFE_METHODS.has(req.method)) return;
  const { origin } = req.headers;
  if (origin && !config.corsOrigins.includes(origin)) {
    throw new ApiError(403, "Origin not allowed");
  }
};

/** Requires a valid auth cookie and loads the user from the database on every request. */
export const protect = asyncHandler(async (req, res, next) => {
  assertTrustedOrigin(req);

  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) throw new ApiError(401, UNAUTHENTICATED);

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, UNAUTHENTICATED); // invalid or expired: same message on purpose
  }
  if (!mongoose.isValidObjectId(payload?.id)) throw new ApiError(401, UNAUTHENTICATED);

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, UNAUTHENTICATED); // deleted user

  req.user = user;
  next();
});

/** Must run after protect. */
export const adminOnly = (req, res, next) => {
  if (!req.user) throw new ApiError(401, UNAUTHENTICATED);
  if (req.user.role !== "admin") throw new ApiError(403, "Admin access required");
  next();
};