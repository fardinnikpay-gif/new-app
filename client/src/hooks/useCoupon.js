import { useCallback, useState } from "react";
import { previewCart } from "../api/cartApi";
import { toPreviewItems } from "../utils/cart";
import useCouponCode from "./useCouponCode";

// Coupon apply/remove logic shared by Cart and Checkout.
// The code is validated with a one-off preview so the error message belongs to the code itself.
export default function useCoupon(items) {
  const [couponCode, setCouponCode] = useCouponCode();
  const [couponError, setCouponError] = useState("");

  const applyCoupon = useCallback(
    async (code) => {
      setCouponError("");
      try {
        await previewCart({ items: toPreviewItems(items), couponCode: code });
        setCouponCode(code);
        return true;
      } catch (err) {
        setCouponError(err.message || "This coupon code isn't valid");
        return false;
      }
    },
    [items, setCouponCode]
  );

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setCouponError("");
  }, [setCouponCode]);

  return { couponCode, couponError, applyCoupon, removeCoupon, setCouponCode };
}