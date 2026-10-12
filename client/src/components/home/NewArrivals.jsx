import { getNewArrivals } from "../../api/productApi";
import useAsync from "../../hooks/useAsync";
import { newArrivalsContent } from "../../data/homeContent";
import Container from "../ui/Container";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import ProductGrid from "../product/ProductGrid";
import ProductGridSkeleton from "../product/ProductGridSkeleton";
import HomeSectionHeader from "./HomeSectionHeader";

const DISPLAY_LIMIT = 8;

export default function NewArrivals() {
  const { data, loading, error, reload } = useAsync(() => getNewArrivals(), []);
  const products = (data?.products ?? []).slice(0, DISPLAY_LIMIT);

  let body = <ProductGrid products={products} />;
  if (loading) body = <ProductGridSkeleton />;
  else if (error) body = <ErrorState message={error.message} onRetry={reload} />;
  else if (!products.length) body = <EmptyState title="No new arrivals yet" />;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <HomeSectionHeader
          eyebrow={newArrivalsContent.eyebrow}
          title={newArrivalsContent.title}
          to="/shop?sort=newest"
        />
        {body}
      </Container>
    </section>
  );
}