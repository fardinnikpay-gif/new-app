import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/cx";
import FormField from "./FormField";

// props: { label, error, id, className, children (<option>s), ...rest }
const Select = forwardRef(function Select({ label, error, id, className, children, ...rest }, ref) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <FormField id={selectId} label={label} error={error} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cx(
            "min-h-11 w-full appearance-none rounded-lg border bg-white pl-4 pr-10 text-base transition-colors",
            "focus:border-primary disabled:cursor-not-allowed disabled:bg-neutral-100",
            error ? "border-danger" : "border-line-strong"
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        />
      </div>
    </FormField>
  );
});

export default Select;