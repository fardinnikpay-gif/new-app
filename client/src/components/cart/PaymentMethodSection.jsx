import { useId } from "react";
import { paymentMethods } from "../../data/checkoutContent";
import SelectableCard from "./SelectableCard";

export default function PaymentMethodSection({ value, onChange }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-medium text-ink">
        Payment method
      </h2>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-6 space-y-3">
        {paymentMethods.map((method) => (
          <SelectableCard
            key={method.value}
            name="payment"
            value={method.value}
            checked={value === method.value}
            disabled={!method.enabled}
            onChange={() => onChange(method.value)}
          >
            <p className="font-medium text-ink">{method.label}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {method.enabled ? method.description : "Currently unavailable"}
            </p>
          </SelectableCard>
        ))}
      </div>
    </section>
  );
}