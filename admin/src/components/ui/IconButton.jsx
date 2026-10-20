import { cx } from "../../utils/cx";

const TONES = {
  neutral: "hover:bg-gray-100 hover:text-ink",
  danger: "hover:bg-danger-bg hover:text-danger-fg",
};

// Icon-only button: `label` is required (it becomes aria-label and tooltip).
export default function IconButton({ icon: Icon, label, tone = "neutral", className, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "rounded-lg p-2.5 text-gray-500 transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500",
        TONES[tone],
        className
      )}
      {...rest}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}