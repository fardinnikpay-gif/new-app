import { cx } from "../../utils/cx";

// Controlled toggle. `label` is required for screen readers.
export default function Switch({ checked, onChange, label, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-primary" : "bg-gray-300",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "inline-block size-5 rounded-full bg-white shadow-card transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}