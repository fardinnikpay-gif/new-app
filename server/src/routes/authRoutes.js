import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const router = Router();

// The limiter runs before validation so invalid attempts are counted too
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;