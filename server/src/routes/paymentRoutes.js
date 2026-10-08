import express, { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createIntentSchema } from "../validators/paymentValidator.js";

// Mounted at /api/payments/webhook BEFORE express.json() in app.js (needs the raw body)
export const webhookRouter = Router();
webhookRouter.post("/", express.raw({ type: "application/json" }), paymentController.handleWebhook);

// Mounted at /api/payments AFTER express.json()
const router = Router();
router.post("/intent", protect, validate(createIntentSchema), paymentController.createPaymentIntent);

export default router;