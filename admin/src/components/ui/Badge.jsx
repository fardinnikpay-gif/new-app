import { cx } from "../../utils/cx";

const TONES = {
  neutral: "bg-gray-100 text-gray-800",
  primary: "bg-primary-dark text-white",
  success: "bg-success-bg text-success-fg",
  warning: "bg-warning-bg text-warning-fg",
  info: "bg-info-bg text-info-fg",
  danger: "bg-danger-bg text-danger-fg",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}