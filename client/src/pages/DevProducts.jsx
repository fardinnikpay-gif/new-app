import { useState } from "react";
import { getProducts } from "../api/productApi";
import ColorSwatch from "../components/product/ColorSwatch";
import DiscountBadge from "../components/product/DiscountBadge";
import PriceTag from "../components/product/PriceTag";
import ProductGrid from "../components/product/ProductGrid";
import SizeSelector from "../components/product/SizeSelector";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";
import { getColors, isColorAvailable } from "../utils/product";

// Deliberately unsorted sizes and one unknown color ("sunset") to test sorting and fallbacks
const VARIANTS = [
  { size: "M", color: "black", stock: 0 },
  { size: "XL", color: "black", stock: 4 },
  { size: "S", color: "black", stock: 3 },
  { size: "L", color: "black", stock: 5 },
  { size: "M", color: "navy", stock: 2 },
  { size: "S", color: "navy", stock: 0 },
  { size: "L", color: "navy", stock: 0 },
  { size: "XS", color: "sunset", stock: 6 },
  { size: "XL", color: "red", stock: 0 },
  { size: "S", color: "red", stock: 0 },
];

const makeVariants = (colors, sizes, stock = 5) =>
  colors.flatMap((color) => sizes.map((size) => ({ size, color, stock })));

const IMAGES = [{ url: "/placeholders/portrait.svg" }, { url: "/placeholders/square.svg" }];

// Fake products for edge cases. Their ids are not in the database: the heart will fail and roll back.
const FAKE_PRODUCTS = [
  {
    _id: "fake-sale",
    slug: "fake-sale",
    title: "Sale hoodie with a second image",
    brand: "Northline",
    price: 120,
    discountPrice: 89,
    images: IMAGES,
    variants: makeVariants(["black", "navy"], ["S", "M", "L"]),
  },
  {
    _id: "fake-sold-out",
    slug: "fake-sold-out",
    title: "Sold out jacket",
    brand: "Northline",
    price: 200,
    discountPrice: 0,
    images: [IMAGES[0]],
    variants: makeVariants(["black"], ["M", "L"], 0),
  },
  {
    _id: "fake-colors",
    slug: "fake-colors",
    title: "A very long product title that must be truncated on one line",
    brand: "Atelier",
    price: 59,
    images: IMAGES,
    variants: makeVariants(["black", "navy", "red", "beige", "olive", "pink", "sunset"], ["S", "M"]),
  },
  {
    _id: "fake-no-image",
    slug: "fake-no-image",
    title: "No image, single option, stock 1",
    price: 35,
    discountPrice: 30,
    images: [],
    variants: makeVariants(["white"], ["M"], 1),
  },
];

function Block({ title, children }) {
  return (
    <section className="space-y-3 rounded-lg border border-line p-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}

export default function DevProducts() {
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const real = useAsync(({ signal }) => getProducts({ page: 1, limit: 8 }, { signal }), []);
  const colors = getColors(VARIANTS);

  return (
    <Container className="space-y-6 py-16">
      <h1 className="text-4xl">Product components (dev)</h1>

      <Block title="ColorSwatch + SizeSelector">
        <div role="group" aria-label="Color" className="flex flex-wrap">
          {colors.map((item) => (
            <ColorSwatch
              key={item}
              color={item}
              selected={color === item}
              disabled={!isColorAvailable(VARIANTS, item)}
              onClick={(next) => {
                setColor(next);
                setSize(null);
              }}
            />
          ))}
        </div>
        <SizeSelector variants={VARIANTS} selectedColor={color} selectedSize={size} onSelect={setSize} />
        <p className="text-sm text-neutral-500">
          color: {color ?? "none"} | size: {size ?? "none"}
        </p>
      </Block>

      <Block title="PriceTag and DiscountBadge">
        <div className="flex flex-wrap items-center gap-6">
          <PriceTag price={120} discountPrice={89} size="lg" />
          <PriceTag price={120} discountPrice={0} />
          <DiscountBadge price={120} discountPrice={89} />
        </div>
      </Block>

      <Block title="ProductCard edge cases (fake data)">
        <ProductGrid products={FAKE_PRODUCTS} />
      </Block>

      <Block title="ProductGrid with real products from the API">
        <Button size="sm" variant="outline" onClick={() => setShowSkeleton((value) => !value)}>
          Toggle skeleton
        </Button>
        {real.error ? (
          <ErrorState message={real.error.message} onRetry={real.reload} />
        ) : (
          <ProductGrid products={real.data?.products ?? []} loading={real.loading || showSkeleton} />
        )}
      </Block>
    </Container>
  );
}