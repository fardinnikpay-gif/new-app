import Container from "../ui/Container";
import Skeleton from "../ui/Skeleton";

const PLACEHOLDER_CARDS = 3;

// Suspense fallback while the code of a lazy page is loading
export default function PageSkeleton() {
  return (
    <Container className="space-y-8 py-16" role="status">
      <span className="sr-only">Loading page</span>
      <Skeleton className="h-10 w-2/3 max-w-lg" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/5] w-full" />
        ))}
      </div>
    </Container>
  );
}