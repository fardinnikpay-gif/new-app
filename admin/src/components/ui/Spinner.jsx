import { cx } from "../../utils/cx";

const SIZES = { sm: "size-4", md: "size-6", lg: "size-10" };

export default function Spinner({ size = "md", className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        SIZES[size],
        className
      )}
    />
  );
}