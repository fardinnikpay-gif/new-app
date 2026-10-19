import { cx } from "../../utils/cx";

export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cx("animate-pulse rounded-lg bg-gray-200", className)} />;
}