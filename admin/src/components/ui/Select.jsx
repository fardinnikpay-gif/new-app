import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";
import Field from "./Field";
import { fieldClass, getDescribedBy } from "./fieldUtils";

// options: [{ value, label }]
const Select = forwardRef(function Select(
  { label, error, hint, id, options = [], placeholder, className, ...rest },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <Field id={selectId} label={label} error={error} hint={hint}>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(selectId, error, hint)}
        className={cx(fieldClass(Boolean(error)), className)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
});

export default Select;