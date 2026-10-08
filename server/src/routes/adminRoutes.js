import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import * as adminOrderController from "../controllers/adminOrderController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateOrderStatusSchema } from "../validators/orderValidator.js";

const router = Router();

// Every /api/admin/* route is admin-only
router.use(protect, adminOnly);

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);

router.get("/orders", adminOrderController.getAllOrders);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), adminOrderController.updateOrderStatus);
router.patch("/orders/:id/paid", adminOrderController.markAsPaid);

export default router;