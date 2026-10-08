import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/env.js";

const buildLimiter = ({ windowMs, limit, message, skip = () => false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => config.isTest || skip(req, res),
    // Go through the central errorHandler so the response shape stays standard
    handler: (req, res, next) => next(new ApiError(429, message)),
  });

/** General limiter for the whole API (mounted on /api). */
export const generalLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many requests, please try again later",
  skip: (req) => req.path === "/health", // req.path is relative to /api
});

/** Strict limiter for register / login / forgot-password / reset-password. */
export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many attempts, please try again in 15 minutes",
});


/**
 * forgot-password and reset-password. Separate counter from authLimiter on purpose:
 * someone locked out by failed logins must still be able to ask for a reset.
 */
export const passwordResetLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many password reset attempts, please try again in 15 minutes",
});


export const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.isTest,
  message: { success: false, message: "Too many coupon attempts, please try again later" },
});

// Only limits requests that actually try a coupon code; shared by /cart/preview and POST /orders
export const limitCouponAttempts = (req, res, next) =>
  req.body?.couponCode ? couponLimiter(req, res, next) : next();