import { getProducts } from "../../api/productApi";
import useAsync from "../../hooks/useAsync";
import { saleContent } from "../../data/homeContent";
import Container from "../ui/Container";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import ProductGrid from "../product/ProductGrid";
import ProductGridSkeleton from "../product/ProductGridSkeleton";
import HomeSectionHeader from "./HomeSectionHeader";

const SALE_PARAMS = { onSale: true, limit: 8 };

// Safety net in case the backend ignores the onSale filter.
const isDiscounted = (product) =>
  product.discountPrice != null && product.discountPrice < product.price;

export default function SaleSection() {
  const { data, loading, error, reload } = useAsync(() => getProducts(SALE_PARAMS), []);
  const products = (data?.products ?? []).filter(isDiscounted);

  let body = <ProductGrid products={products} />;
  if (loading) body = <ProductGridSkeleton />;
  else if (error) body = <ErrorState message={error.message} onRetry={reload} />;
  else if (!products.length) body = <EmptyState title="No sale items right now" />;

  return (
    <section className="bg-ink py-16 md:py-24">
      <Container>
        <HomeSectionHeader
          tone="dark"
          eyebrow={saleContent.eyebrow}
          title={saleContent.title}
          to="/shop?onSale=true"
        />
        {/* Product cards use ink text, so they sit on a white panel over the dark band. */}
        <div className="rounded-lg bg-white p-4 md:p-8">{body}</div>
      </Container>
    </section>
  );
}