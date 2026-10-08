import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as paymentService from "../services/paymentService.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { clientSecret } = await paymentService.createPaymentIntent(
    req.user._id,
    req.body.orderId
  );
  sendSuccess(res, 200, "Payment intent created", { clientSecret });
});

export const handleWebhook = asyncHandler(async (req, res) => {
  await paymentService.handleWebhook(req.body, req.headers["stripe-signature"]);
  sendSuccess(res, 200, "Webhook received", { received: true });
});