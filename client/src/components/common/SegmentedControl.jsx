import { useId } from "react";

// Pill-style radio group (native radios, so arrow keys and screen readers just work).
export default function SegmentedControl({ label, options, value, onChange }) {
  const name = useId();

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-neutral-100 p-1">
      {options.map((option) => (
        <label key={option.value} className="relative cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex min-h-11 items-center rounded-full px-5 text-sm text-neutral-600 transition-colors peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}