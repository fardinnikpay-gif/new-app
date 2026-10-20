import Skeleton from "../ui/Skeleton";

const SECTION_COUNT = 4;

export default function ProductFormSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="mx-auto max-w-3xl space-y-6">
      {Array.from({ length: SECTION_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-44 w-full" />
      ))}
    </div>
  );
}