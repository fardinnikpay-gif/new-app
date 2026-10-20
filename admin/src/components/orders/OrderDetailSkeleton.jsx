import { cx } from "../../utils/cx";
import Skeleton from "../ui/Skeleton";

const HEIGHTS = ["h-36", "h-20", "h-24", "h-28", "h-44"];

export default function OrderDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading order" className="space-y-4">
      {HEIGHTS.map((height) => (
        <Skeleton key={height} className={cx(height, "w-full")} />
      ))}
    </div>
  );
}