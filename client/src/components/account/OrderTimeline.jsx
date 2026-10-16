import { Check } from "lucide-react";
import { ORDER_STEPS } from "../../data/orderContent";
import { cx } from "../../utils/cx";

// Four-step progress for a normal order; a cancelled order shows a notice instead.
export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <p role="status" className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        This order was cancelled.
      </p>
    );
  }

  const current = ORDER_STEPS.findIndex((step) => step.value === status);

  return (
    <ol aria-label="Order progress" className="grid grid-cols-4">
      {ORDER_STEPS.map((step, index) => {
        const done = index <= current;
        return (
          <li
            key={step.value}
            aria-current={index === current ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cx(
                  "absolute -left-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                  index <= current ? "bg-primary" : "bg-neutral-200"
                )}
              />
            )}
            <span
              className={cx(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs",
                done
                  ? "border-primary bg-primary text-white"
                  : "border-neutral-300 bg-white text-neutral-500"
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className={cx("mt-2 text-xs", done ? "font-medium text-ink" : "text-neutral-500")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}