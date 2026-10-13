import { useCallback, useRef, useState } from "react";
import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { toPreviewItems } from "../utils/cart";

const STOCK_ERROR_STATUSES = [400, 409, 422];
const STOCK_ERROR_PATTERN = /stock|available|inventory|out of/i;

const isStockError = (error) =>
  STOCK_ERROR_STATUSES.includes(error.status) && STOCK_ERROR_PATTERN.test(error.message ?? "");

// placeOrder(shippingAddress, paymentMethod, couponCode) -> order, or null on failure.
// A ref guards against double submits; stockProblem tells the page to send the user back to the cart.
export default function usePlaceOrder() {
  const { items } = useCart();
  const submittingRef = useRef(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [stockProblem, setStockProblem] = useState(false);

  const placeOrder = useCallback(
    async (shippingAddress, paymentMethod, couponCode) => {
      if (submittingRef.current) return null;
      submittingRef.current = true;
      setPlacing(true);
      setError("");
      setStockProblem(false);

      try {
        const { order } = await createOrder({
          items: toPreviewItems(items),
          shippingAddress,
          paymentMethod,
          couponCode: couponCode || undefined,
        });
        return order;
      } catch (err) {
        setError(err.message || "We couldn't place your order. Please try again.");
        setStockProblem(isStockError(err));
        return null;
      } finally {
        submittingRef.current = false;
        setPlacing(false);
      }
    },
    [items]
  );

  return { placeOrder, placing, error, stockProblem };
}