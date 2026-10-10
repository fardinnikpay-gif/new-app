import { cx } from "../../utils/cx";

const TONES = {
  sale: "bg-primary text-white",
  new: "bg-ink text-white",
  neutral: "bg-neutral-100 text-neutral-700",
};

// props: { tone: sale|new|neutral, className, children }
export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}