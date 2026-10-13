import { useCallback, useState } from "react";
import { createPaymentIntent } from "../api/paymentApi";

const INITIAL = { orderId: null, clientSecret: null, loading: false, error: "" };

// Card flow after the order exists: fetch the payment intent for that order.
// retry() asks for a new intent for the SAME order (never creates another order).
export default function useCardPayment() {
  const [state, setState] = useState(INITIAL);

  const start = useCallback(async (orderId) => {
    setState({ orderId, clientSecret: null, loading: true, error: "" });
    try {
      const { clientSecret } = await createPaymentIntent(orderId);
      setState({ orderId, clientSecret, loading: false, error: "" });
    } catch (err) {
      setState({
        orderId,
        clientSecret: null,
        loading: false,
        error: err.message || "We couldn't start the payment. Please try again.",
      });
    }
  }, []);

  const retry = useCallback(() => {
    if (state.orderId) start(state.orderId);
  }, [state.orderId, start]);

  return { ...state, active: Boolean(state.orderId), start, retry };
}