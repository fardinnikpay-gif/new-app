import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";
import Field from "./Field";
import { fieldClass, getDescribedBy } from "./fieldUtils";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, rows = 4, className, ...rest },
  ref
) {
  const autoId = useId();
  const textareaId = id || autoId;

  return (
    <Field id={textareaId} label={label} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(textareaId, error, hint)}
        className={cx(fieldClass(Boolean(error)), className)}
        {...rest}
      />
    </Field>
  );
});

export default Textarea;