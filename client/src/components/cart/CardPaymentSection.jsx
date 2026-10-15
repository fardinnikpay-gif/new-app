import { Link } from "react-router-dom";
import { formatOrderNumber } from "../../utils/order";
import FormError from "../account/FormError";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import StripePaymentForm from "./StripePaymentForm";
import { lazy, Suspense, useId } from "react";

// Shown instead of the address/payment sections once the order exists.
export default function CardPaymentSection({ orderId, clientSecret, loading, error, onRetry, onSuccess }) {
  const headingId = useId();

  const StripePaymentForm = lazy(() => import("./StripePaymentForm"));

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-medium text-ink">
        Payment
      </h2>
      <p className="mt-2 text-neutral-600">
        Order {formatOrderNumber(orderId)} has been created. Complete your card payment to confirm it.
      </p>

      <div className="mt-6">
        {loading && <Skeleton className="h-48 w-full" />}

        {error && (
          <div className="space-y-4">
            <FormError message={error} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={onRetry}>Try again</Button>
              <Button as={Link} to={`/account/orders/${orderId}`} variant="outline">
                View order
              </Button>
            </div>
          </div>
        )}

        {clientSecret && (
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <StripePaymentForm clientSecret={clientSecret} orderId={orderId} onSuccess={onSuccess} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
