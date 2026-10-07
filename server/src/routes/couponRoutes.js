import { Router } from "express";
import * as couponController from "../controllers/couponController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { couponLimiter } from "../middleware/rateLimiters.js";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  sendCouponSchema,
} from "../validators/couponValidator.js";

const router = Router();

router.use(protect);

// Customer route (any logged-in user)
router.post("/validate", couponLimiter, validate(validateCouponSchema), couponController.validateCoupon);

// Everything below this line is admin-only
router.use(adminOnly);

router.get("/", couponController.getCoupons);
router.post("/", validate(createCouponSchema), couponController.createCoupon);
router.put("/:id", validate(updateCouponSchema), couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);
router.post("/:id/send", validate(sendCouponSchema), couponController.sendCouponByEmail);

export default router;