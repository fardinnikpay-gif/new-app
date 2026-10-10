import { cx } from "../../utils/cx";

// props: { className } , set size with classes, e.g. "h-24 w-full"
export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cx("animate-pulse rounded-lg bg-neutral-200", className)} />;
}