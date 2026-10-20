import { cx } from "../../utils/cx";

// options: [{ value, label }]. Buttons (not tabs): they filter one list, no tab panels.
export default function FilterTabs({ options, value, onChange, label = "Filter" }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:-mx-1 sm:px-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-white"
                : "border-gray-300 bg-white text-ink hover:bg-gray-50"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}