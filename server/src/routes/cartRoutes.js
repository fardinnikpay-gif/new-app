import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { validate } from "../middleware/validate.js";
import { limitCouponAttempts } from "../middleware/rateLimiters.js";
import { previewCartSchema } from "../validators/cartValidator.js";

const router = Router();

// Public route, so coupon guessing is limited here too (counter shared with /coupons/validate)
router.post("/preview", limitCouponAttempts, validate(previewCartSchema), cartController.previewCart);

export default router;