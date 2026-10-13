import { Check } from "lucide-react";
import { cx } from "../../utils/cx";

export default function FilterOption({ label, selected, onClick, className }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm transition-colors",
        selected ? "font-medium text-ink" : "text-neutral-600 hover:text-ink",
        className
      )}
    >
      <span>{label}</span>
      {selected && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
    </button>
  );
}