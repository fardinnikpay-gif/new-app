import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripeAppearance, stripePromise } from "../../utils/stripe";
import FormError from "../account/FormError";
import Button from "../ui/Button";

const DONE_STATUSES = ["succeeded", "processing"];
const USER_ERROR_TYPES = ["card_error", "validation_error"];
const GENERIC_ERROR = "Something went wrong with your payment. Please try again.";

function PaymentForm({ orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const lockRef = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || lockRef.current) return;
    lockRef.current = true;
    setSubmitting(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: `${window.location.origin}/checkout/success/${orderId}` },
      });

      if (stripeError) {
        setError(USER_ERROR_TYPES.includes(stripeError.type) ? stripeError.message : GENERIC_ERROR);
      } else if (DONE_STATUSES.includes(paymentIntent?.status)) {
        onSuccess(paymentIntent);
      } else {
        setError("We couldn't confirm your payment. Please try again.");
      }
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      lockRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PaymentElement onReady={() => setReady(true)} />

      {error && (
        <div className="mt-4 space-y-2">
          <FormError message={error} />
          <Link
            to={`/account/orders/${orderId}`}
            className="inline-flex min-h-11 items-center text-sm text-neutral-600 underline underline-offset-4 hover:text-ink"
          >
            View this order
          </Link>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        loading={submitting}
        disabled={!stripe || !ready}
      >
        Pay now
      </Button>
    </form>
  );
}

// Elements options are created once per clientSecret (they must not change while mounted).
export default function StripePaymentForm({ clientSecret, orderId, onSuccess }) {
  const options = useMemo(
    () => ({ clientSecret, appearance: getStripeAppearance() }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
}