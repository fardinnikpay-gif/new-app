import { cx } from "../../utils/cx";

// Label + hint/error wrapper shared by Input, Select, Textarea.
export default function Field({ id, label, error, hint, children, className }) {
  return (
    <div className={cx("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}