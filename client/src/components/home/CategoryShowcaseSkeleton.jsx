import Skeleton from "../ui/Skeleton";

export default function CategoryShowcaseSkeleton() {
  return (
    <div aria-busy="true">
      <Skeleton className="mb-10 h-12 w-64" />
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-4/5 w-full" />
        ))}
      </div>
    </div>
  );
}