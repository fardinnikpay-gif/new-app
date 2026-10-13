import { cx } from "../../utils/cx";

// A bordered radio option (used for addresses and payment methods).
export default function SelectableCard({ name, value, checked, onChange, disabled, children }) {
  return (
    <label
      className={cx(
        "flex items-start gap-4 rounded-lg border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
        checked ? "border-ink bg-neutral-50" : "border-neutral-200 hover:border-neutral-400",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-primary"
      />
      <div className="min-w-0 flex-1">{children}</div>
    </label>
  );
}