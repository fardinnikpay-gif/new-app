import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx";

const Checkbox = forwardRef(function Checkbox({ label, id, className, ...rest }, ref) {
  const autoId = useId();
  const checkboxId = id || autoId;

  return (
    <div className={cx("flex items-center gap-2", className)}>
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className="size-4 rounded border-gray-300 accent-primary"
        {...rest}
      />
      <label htmlFor={checkboxId} className="text-sm text-ink">
        {label}
      </label>
    </div>
  );
});

export default Checkbox;