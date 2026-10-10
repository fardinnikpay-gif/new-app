import { Minus, Plus } from "lucide-react";
import { cx } from "../../utils/cx";

const STEP_BUTTON =
  "grid h-11 w-11 place-items-center transition-colors hover:bg-neutral-100 " +
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

// props: { value, onChange(next), min, max, disabled, className } , max is usually the variant stock
export default function QuantityInput({ value, onChange, min = 1, max, disabled = false, className }) {
  const atMin = value <= min;
  const atMax = max != null && value >= max;

  const change = (next) => {
    const upper = max ?? next;
    onChange(Math.min(upper, Math.max(min, next)));
  };

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cx("inline-flex items-center rounded-lg border border-line-strong", className)}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || atMin}
        onClick={() => change(value - 1)}
        className={cx(STEP_BUTTON, "rounded-l-lg")}
      >
        <Minus aria-hidden="true" className="h-4 w-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        readOnly
        aria-label="Current quantity"
        value={value}
        className="w-10 bg-transparent text-center text-sm font-medium"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        onClick={() => change(value + 1)}
        className={cx(STEP_BUTTON, "rounded-r-lg")}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}