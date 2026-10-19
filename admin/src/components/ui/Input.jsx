import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";
import Field from "./Field";
import { fieldClass, getDescribedBy } from "./fieldUtils";

const Input = forwardRef(function Input(
  { label, error, hint, id, type = "text", className, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <Field id={inputId} label={label} error={error} hint={hint}>
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(inputId, error, hint)}
        className={cx(fieldClass(Boolean(error)), className)}
        {...rest}
      />
    </Field>
  );
});

export default Input;