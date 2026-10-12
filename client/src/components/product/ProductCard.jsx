import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { DURATION, EASE } from "../../animations/variants";
import { useWishlist } from "../../context/WishlistContext";
import useMediaQuery from "../../hooks/useMediaQuery";
import { cx } from "../../utils/cx";
import { QUERIES } from "../../utils/media";
import { getColors, isInStock } from "../../utils/product";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ColorSwatch from "./ColorSwatch";
import DiscountBadge from "./DiscountBadge";
import PriceTag from "./PriceTag";
import QuickAddPopover from "./QuickAddPopover";

const MAX_SWATCHES = 5;
const FALLBACK_IMAGE = "/placeholders/portrait.svg";
const IMAGE_ZOOM = 1.04;
const IMAGE_ZOOM_SECONDS = 0.6;
const ACTION_OFFSET_PX = 8;
const HEART_POP = [1, 1.3, 1];
const HEART_POP_SECONDS = 0.3;

const ZOOM = { rest: { scale: 1 }, active: { scale: IMAGE_ZOOM } };
const CROSSFADE = { rest: { opacity: 0 }, active: { opacity: 1 } };
const ACTION = { rest: { opacity: 0, y: ACTION_OFFSET_PX }, active: { opacity: 1, y: 0 } };

const handleImageError = (event) => {
  if (!event.currentTarget.src.endsWith(FALLBACK_IMAGE)) event.currentTarget.src = FALLBACK_IMAGE;
};

// props: { product, priority } | priority: load the image eagerly (first row, LCP)
export default function ProductCard({ product, priority = false }) {
  const { ids, toggle } = useWishlist();
  const canHover = useMediaQuery(QUERIES.hover);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const closeQuickAdd = useCallback(() => setQuickAddOpen(false), []);

  const url = `/product/${encodeURIComponent(product.slug)}`;
  const saved = ids.has(product._id);
  const inStock = isInStock(product);
  const colors = getColors(product.variants);
  const [mainImage, hoverImage] = product.images ?? [];

  // Hover effects exist only for mouse users; touch users always see the quick-add button.
  const active = canHover && (hovered || focused || quickAddOpen);
  const showQuickAdd = !canHover || active;

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlur={handleBlur}
    >
      <motion.div
        initial={false}
        animate={active ? "active" : "rest"}
        className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100"
      >
        {/* decorative duplicate of the title link, so it is skipped by keyboard and screen readers */}
        <Link to={url} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
          <motion.div variants={ZOOM} transition={{ duration: IMAGE_ZOOM_SECONDS, ease: EASE.out }} className="relative h-full w-full">
            <img
              src={mainImage?.url ?? FALLBACK_IMAGE}
              alt=""
              width="800"
              height="1000"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              decoding="async"
              onError={handleImageError}
              className="h-full w-full object-cover"
            />
            {canHover && hoverImage && (
              <motion.img
                variants={CROSSFADE}
                transition={{ duration: DURATION.base, ease: EASE.out }}
                src={hoverImage.url}
                alt=""
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </motion.div>
        </Link>

        {inStock ? (
          <DiscountBadge
            price={product.price}
            discountPrice={product.discountPrice}
            className="pointer-events-none absolute left-3 top-3"
          />
        ) : (
          <Badge tone="neutral" className="pointer-events-none absolute left-3 top-3">
            Sold out
          </Badge>
        )}

        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          onClick={() => toggle(product._id, product)}
          className="absolute right-1 top-1 grid h-11 w-11 place-items-center rounded-full"
        >
          <motion.span
            initial={false}
            animate={{ scale: saved ? HEART_POP : 1 }}
            transition={{ duration: HEART_POP_SECONDS }}
            className={cx(
              "grid h-8 w-8 place-items-center rounded-full bg-surface/90 shadow-soft transition-colors",
              saved ? "text-primary" : "text-ink"
            )}
          >
            <Heart aria-hidden="true" className={cx("h-4 w-4", saved && "fill-current")} />
          </motion.span>
        </button>

        <motion.div
          initial={false}
          animate={showQuickAdd ? "active" : "rest"}
          variants={ACTION}
          transition={{ duration: DURATION.fast, ease: EASE.out }}
          className="absolute inset-x-3 bottom-3"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-surface"
            disabled={!inStock}
            aria-haspopup="dialog"
            aria-expanded={quickAddOpen}
            onClick={() => setQuickAddOpen(true)}
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            {inStock ? "Quick add" : "Sold out"}
          </Button>
        </motion.div>

        <AnimatePresence>
          {quickAddOpen && <QuickAddPopover key="quick-add" product={product} onClose={closeQuickAdd} />}
        </AnimatePresence>
      </motion.div>

      <div className="mt-3 space-y-1.5">
        {product.brand && (
          <p className="truncate text-xs uppercase tracking-widest text-neutral-500">{product.brand}</p>
        )}
        <h3 className="truncate text-sm font-medium">
          <Link to={url} className="hover:text-primary">
            {product.title}
          </Link>
        </h3>
        <PriceTag price={product.price} discountPrice={product.discountPrice} size="sm" />
        {colors.length > 0 && (
          <div role="group" aria-label="Available colors" className="flex items-center gap-1.5">
            {colors.slice(0, MAX_SWATCHES).map((color) => (
              <ColorSwatch key={color} color={color} size="sm" />
            ))}
            {colors.length > MAX_SWATCHES && (
              <span className="text-xs text-neutral-500">+{colors.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}