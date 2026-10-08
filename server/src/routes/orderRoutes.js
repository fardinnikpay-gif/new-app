import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { limitCouponAttempts } from "../middleware/rateLimiters.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const router = Router();

router.use(protect);

router.post("/", limitCouponAttempts, validate(createOrderSchema), orderController.createOrder);

// Step 21 adds: GET /my (MUST be defined before /:id), GET /:id, PATCH /:id/cancel

export default router;