import { cx } from "../../utils/cx";

const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

// props: { size: sm|md|lg, label: string | null (null = decorative), className }
export default function Spinner({ size = "md", label = "Loading", className }) {
  const a11y = label ? { role: "status", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg {...a11y} className={cx("animate-spin", SIZES[size], className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}