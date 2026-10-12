import Skeleton from "../ui/Skeleton";

// 2 columns on phones, 3 on tablets, 4 on desktop. Shared with ProductGrid so both always line up.
export const GRID_CLASS = "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4";

const DEFAULT_COUNT = 8;

// props: { count }
export default function ProductGridSkeleton({ count = DEFAULT_COUNT }) {
  return (
    <div role="status" aria-busy="true" className={GRID_CLASS}>
      <span className="sr-only">Loading products</span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}