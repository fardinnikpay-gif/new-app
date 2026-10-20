import { cx } from "../../utils/cx";
import Skeleton from "../ui/Skeleton";

// className sets the height, e.g. "h-72".
export default function ChartSkeleton({ className }) {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className={cx("w-full", className)} />
    </div>
  );
}