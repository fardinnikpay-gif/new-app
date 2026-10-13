import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { MAX_QTY_DEFAULT } from "../../data/productContent";
import { hasDiscount } from "../../utils/product";
import { cx } from "../../utils/cx";
import QuantityInput from "../ui/QuantityInput";
import AddToCartButton from "./AddToCartButton";
import ColorSwatch from "./ColorSwatch";
import DiscountBadge from "./DiscountBadge";
import PriceTag from "./PriceTag";
import SizeGuideModal from "./SizeGuideModal";
import SizeSelector from "./SizeSelector";

function StockNote({ selection }) {
  const { soldOut, size, stock, lowStock } = selection;
  let text = "";
  if (soldOut) text = "Out of stock";
  else if (size && stock === 0) text = "Out of stock in this size";
  else if (lowStock) text = `Only ${stock} left`;

  if (!text) return null;
  return (
    <p role="status" className={cx("mt-4 text-sm", lowStock ? "text-primary" : "text-neutral-600")}>
      {text}
    </p>
  );
}

export default function ProductInfo({ product, selection, ctaRef }) {
  const { ids, toggle } = useWishlist();
  const [guideOpen, setGuideOpen] = useState(false);
  const liked = ids.has(product._id);

  const { colors, variants, color, size, qty, variant, soldOut, status, error } = selection;
  const maxQty = variant ? Math.max(variant.stock, 1) : MAX_QTY_DEFAULT;

  return (
    <div>
      {product.brand && (
        <Link
          to={`/shop?brand=${encodeURIComponent(product.brand)}`}
          className="text-sm uppercase tracking-widest text-primary hover:underline"
        >
          {product.brand}
        </Link>
      )}
      <h1 className="mt-2 text-3xl font-light tracking-tight text-ink md:text-4xl">
        {product.title}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <PriceTag price={product.price} discountPrice={product.discountPrice} />
        {hasDiscount(product) && (
          <DiscountBadge price={product.price} discountPrice={product.discountPrice} />
        )}
      </div>

      {colors.length > 0 && (
        <section className="mt-8" aria-label="Color">
          <p className="mb-3 text-sm">
            <span className="font-medium text-ink">Color:</span>{" "}
            <span className="capitalize text-neutral-600">{color}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map((item) => (
              <ColorSwatch
                key={item}
                color={item}
                size="md"
                selected={item === color}
                onClick={() => selection.selectColor(item)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-label="Size">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Size{size ? `: ${size}` : ""}</p>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="min-h-11 text-sm text-neutral-600 underline underline-offset-4 hover:text-ink"
          >
            Size guide
          </button>
        </div>
        <SizeSelector
          variants={variants}
          selectedSize={size}
          selectedColor={color}
          onSelect={selection.selectSize}
        />
      </section>

      <StockNote selection={selection} />

      <div className="mt-6">
        <QuantityInput
          value={qty}
          onChange={selection.setQty}
          min={1}
          max={maxQty}
        />
      </div>

      <div ref={ctaRef} className="mt-8 flex items-stretch gap-3">
        <AddToCartButton status={status} soldOut={soldOut} onClick={selection.addToCart} />
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product._id)}
          className="flex w-12 shrink-0 items-center justify-center rounded-md border border-neutral-300 transition-colors hover:border-ink"
        >
          <Heart
            className={cx("h-5 w-5", liked ? "fill-primary text-primary" : "text-ink")}
            aria-hidden="true"
          />
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}