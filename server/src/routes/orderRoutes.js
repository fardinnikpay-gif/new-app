import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { limitCouponAttempts } from "../middleware/rateLimiters.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const router = Router();

router.use(protect);

router.post("/", limitCouponAttempts, validate(createOrderSchema), orderController.createOrder);

// "/my" MUST be defined before "/:id", otherwise "my" is read as an id
router.get("/my", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/cancel", orderController.cancelOrder);

export default router;