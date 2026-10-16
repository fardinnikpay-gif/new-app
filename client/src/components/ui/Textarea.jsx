import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";

// Same API as Input: { label, error, ...rest } with forwardRef for react-hook-form.
const Textarea = forwardRef(function Textarea({ label, error, className, id, rows = 5, ...rest }, ref) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "w-full rounded-md border bg-white px-4 py-3 text-ink placeholder:text-neutral-500",
          error ? "border-red-500" : "border-neutral-500 hover:border-ink",
          className
        )}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Textarea;