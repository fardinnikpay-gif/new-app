import Container from "../ui/Container";
import Skeleton from "../ui/Skeleton";

export default function ProductDetailSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <div aria-busy="true" className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-4/5 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-8 h-24 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </Container>
  );
}