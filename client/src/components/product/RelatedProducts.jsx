import { getRelatedProducts } from "../../api/productApi";
import useAsync from "../../hooks/useAsync";
import Container from "../ui/Container";
import HomeSectionHeader from "../home/HomeSectionHeader";
import ProductGrid from "./ProductGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

const DISPLAY_LIMIT = 4;

// Secondary content: an error or empty result simply hides the section.
export default function RelatedProducts({ slug }) {
  const { data, loading, error } = useAsync(() => getRelatedProducts(slug), [slug]);
  const products = (data?.products ?? []).slice(0, DISPLAY_LIMIT);

  if (!loading && (error || !products.length)) return null;

  return (
    <section className="border-t border-neutral-200 py-16 md:py-24">
      <Container>
        <HomeSectionHeader eyebrow="You may also like" title="Related products" />
        {loading ? <ProductGridSkeleton /> : <ProductGrid products={products} />}
      </Container>
    </section>
  );
}