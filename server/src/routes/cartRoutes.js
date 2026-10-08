import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { validate } from "../middleware/validate.js";
import { couponLimiter } from "../middleware/rateLimiters.js";
import { previewCartSchema } from "../validators/cartValidator.js";

const router = Router();

// Public route, so coupon guessing must be limited here too (shares the counter with /coupons/validate).
// Requests without a coupon are not limited because the client previews the cart often.
const limitCouponAttempts = (req, res, next) =>
  req.body?.couponCode ? couponLimiter(req, res, next) : next();

router.post("/preview", limitCouponAttempts, validate(previewCartSchema), cartController.previewCart);

export default router;