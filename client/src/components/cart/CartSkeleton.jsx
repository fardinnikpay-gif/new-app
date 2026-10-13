import Container from "../ui/Container";
import Skeleton from "../ui/Skeleton";

export default function CartSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <div aria-busy="true">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div className="space-y-6">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </Container>
  );
}