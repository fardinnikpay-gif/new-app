import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter, passwordResetLimiter } from "../middleware/rateLimiters.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetTokenParamSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = Router();

// The limiter runs before validation so invalid attempts are counted too
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);
router.put(
  "/reset-password/:token",
  passwordResetLimiter,
  validate(resetTokenParamSchema, "params"),
  validate(resetPasswordSchema),
  resetPassword
);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;