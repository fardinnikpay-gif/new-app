import { useRef } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import useProductSelection from "../../hooks/useProductSelection";
import useStickyBar from "../../hooks/useStickyBar";
import { buildProductJsonLd, getProductCategory, getProductDescription } from "../../utils/product";
import Seo from "../common/Seo";
import Breadcrumbs from "../ui/Breadcrumbs";
import Container from "../ui/Container";
import MobileAddBar from "./MobileAddBar";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import useScrollShift from "../../hooks/useScrollShift";

const TABLET_UP_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const GALLERY_SHIFT = { y: 40 };

// Rendered with key={product._id}, so selection state resets per product.
export default function ProductView({ product }) {
  const selection = useProductSelection(product);
  const ctaRef = useRef(null);
  const endRef = useRef(null);
  const isPhone = !useMediaQuery(TABLET_UP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const showBar = useStickyBar(ctaRef, endRef, isPhone);
  const category = getProductCategory(product);


  const galleryRef = useRef(null);
  useScrollShift(galleryRef, GALLERY_SHIFT);

  const handleBarAdd = () => {
    const result = selection.addToCart();
    if (!result.ok && result.reason === "size") {
      ctaRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  };

  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    ...(category
      ? [{ label: category, to: `/shop?category=${encodeURIComponent(category)}` }]
      : []),
    { label: product.title },
  ];

  return (
    <>
      <Seo
        title={product.title}
        description={getProductDescription(product)}
        image={product.images?.[0]?.url}
        type="product"
        jsonLd={buildProductJsonLd(product)}
      />

      <Container className="pb-24 pt-6 md:pb-16 md:pt-10">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div ref={galleryRef}>
            <ProductGallery images={product.images} title={product.title} />
          </div>
          {/* sticky instead of a GSAP pin: same look, no pin-spacer, no JS */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo product={product} selection={selection} ctaRef={ctaRef} />
          </div>
        </div>
        <ProductTabs product={product} />
        <div ref={endRef} aria-hidden="true" />
      </Container>

      <RelatedProducts slug={product.slug} />

      <MobileAddBar
        product={product}
        visible={showBar}
        status={selection.status}
        soldOut={selection.soldOut}
        onAdd={handleBarAdd}
      />
    </>
  );
}