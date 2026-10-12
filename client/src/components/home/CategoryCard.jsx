import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_IMAGE_SIZE } from "../../data/homeContent";
import { cx } from "../../utils/cx";
import { getCategoryImage, getCategoryKey, getCategoryLabel } from "../../utils/categories";

const HOVER_SCALE = 1.05;
const HOVER_TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

// data-cat-* attributes are the hooks for useCategoryShowcaseScroll.
// Overlays are pointer-events-none so Framer's hover reaches the image layer.
export default function CategoryCard({ category, className }) {
  const reduceMotion = useReducedMotion();
  const label = getCategoryLabel(category);

  return (
    <Link
      to={`/shop?category=${encodeURIComponent(getCategoryKey(category))}`}
      data-cat-card
      className={cx("group relative block overflow-hidden rounded-lg bg-neutral-200", className)}
    >
      <div data-cat-image className="absolute inset-0">
        <motion.div
          className="h-full w-full"
          whileHover={reduceMotion ? undefined : { scale: HOVER_SCALE }}
          transition={HOVER_TRANSITION}
        >
          <img
            data-cat-img
            src={getCategoryImage(category)}
            alt={`${label} collection`}
            width={CATEGORY_IMAGE_SIZE.width}
            height={CATEGORY_IMAGE_SIZE.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 to-transparent"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
        <h3 className="text-3xl font-light capitalize tracking-tight md:text-4xl">{label}</h3>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}