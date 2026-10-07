import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as couponService from "../services/couponService.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const result = await couponService.validateCoupon(code, subtotal);
  sendSuccess(res, 200, "Coupon is valid", result);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getCoupons();
  sendSuccess(res, 200, "Coupons fetched", { coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  sendSuccess(res, 201, "Coupon created", { coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  sendSuccess(res, 200, "Coupon updated", { coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  sendSuccess(res, 200, "Coupon deleted", {});
});

export const sendCouponByEmail = asyncHandler(async (req, res) => {
  const { sent } = await couponService.sendCouponByEmail(req.params.id, req.body.emails);
  sendSuccess(res, 200, "Coupon emails sent", { sent });
});