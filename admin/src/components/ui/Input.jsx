import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";
import Field from "./Field";
import { fieldClass, getDescribedBy } from "./fieldUtils";

// endAdornment: optional element shown inside the field on the right (e.g. a toggle button).
const Input = forwardRef(function Input(
  { label, error, hint, id, type = "text", endAdornment, className, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <Field id={inputId} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={getDescribedBy(inputId, error, hint)}
          className={cx(fieldClass(Boolean(error)), endAdornment && "pr-10", className)}
          {...rest}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endAdornment}</div>
        )}
      </div>
    </Field>
  );
});

export default Input;