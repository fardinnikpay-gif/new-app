import { useState } from "react";
import ColorSwatch from "../components/product/ColorSwatch";
import DiscountBadge from "../components/product/DiscountBadge";
import PriceTag from "../components/product/PriceTag";
import SizeSelector from "../components/product/SizeSelector";
import Container from "../components/ui/Container";
import { getColors, getDiscountPercent, isColorAvailable } from "../utils/product";

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
  const colors = getColors(VARIANTS);

  return (
    <Container className="space-y-6 py-16">
      <h1 className="text-4xl">Product components (dev)</h1>

      <Block title="ColorSwatch: static sizes">
        <div className="flex items-center gap-3">
          <ColorSwatch color="black" size="sm" />
          <ColorSwatch color="navy" size="md" />
          <ColorSwatch color="beige" size="lg" />
          <ColorSwatch color="sunset" size="lg" />
        </div>
      </Block>

      <Block title="ColorSwatch: selectable (red has no stock, sunset is an unknown color)">
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
        <p className="text-sm text-neutral-500">selected color: {color ?? "none"}</p>
      </Block>

      <Block title="SizeSelector: follows the selected color above">
        <SizeSelector variants={VARIANTS} selectedColor={color} selectedSize={size} onSelect={setSize} />
        <p className="text-sm text-neutral-500">selected size: {size ?? "none"}</p>
      </Block>

      <Block title="PriceTag">
        <div className="flex flex-wrap items-baseline gap-8">
          <PriceTag price={120} discountPrice={89} size="sm" />
          <PriceTag price={120} discountPrice={89} />
          <PriceTag price={120} discountPrice={89} size="lg" />
          <PriceTag price={120} discountPrice={120} />
          <PriceTag price={120} discountPrice={0} />
          <PriceTag price="abc" />
        </div>
      </Block>

      <Block title="DiscountBadge">
        <div className="flex flex-wrap items-center gap-4">
          <DiscountBadge price={120} discountPrice={89} />
          <DiscountBadge price={100} discountPrice={79} />
          <DiscountBadge price={100} discountPrice={100} />
          <DiscountBadge price={100} discountPrice={0} />
          <span className="text-sm text-neutral-500">getDiscountPercent(120, 89) = {getDiscountPercent(120, 89)}</span>
        </div>
      </Block>
    </Container>
  );
}