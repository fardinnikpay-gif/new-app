import { cx } from "../../utils/cx";
import Skeleton from "../ui/Skeleton";

const HEIGHTS = ["h-12", "h-28", "h-16", "h-32"];

export default function UserDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading user" className="space-y-4">
      {HEIGHTS.map((height) => (
        <Skeleton key={height} className={cx(height, "w-full")} />
      ))}
    </div>
  );
}