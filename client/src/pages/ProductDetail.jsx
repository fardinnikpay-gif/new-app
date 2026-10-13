import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../api/productApi";
import useAsync from "../hooks/useAsync";
import ProductDetailSkeleton from "../components/product/ProductDetailSkeleton";
import ProductView from "../components/product/ProductView";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const NOT_FOUND_STATUS = 404;

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useAsync(() => getProductBySlug(slug), [slug]);

  if (loading) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <Container className="flex flex-col items-center gap-4 py-16 md:py-24">
        {error.status === NOT_FOUND_STATUS ? (
          <>
            <EmptyState title="Product not found" />
            <Button as={Link} to="/shop">
              Continue shopping
            </Button>
          </>
        ) : (
          <ErrorState message={error.message} onRetry={reload} />
        )}
      </Container>
    );
  }

  if (!data?.product) return null;
  return <ProductView key={data.product._id} product={data.product} />;
}