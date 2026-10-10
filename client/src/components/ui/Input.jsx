import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";
import FormField from "./FormField";

// props: { label, error, id, className, ...rest } , className applies to the wrapper
const Input = forwardRef(function Input({ label, error, id, className, ...rest }, ref) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <FormField id={inputId} label={label} error={error} className={className}>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cx(
          "min-h-11 w-full rounded-lg border bg-white px-4 text-base transition-colors",
          "placeholder:text-neutral-400 focus:border-primary disabled:cursor-not-allowed disabled:bg-neutral-100",
          error ? "border-danger" : "border-line-strong"
        )}
        {...rest}
      />
    </FormField>
  );
});

export default Input;