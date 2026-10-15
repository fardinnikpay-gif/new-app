import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import ProductCard from "../product/ProductCard";

const EXIT = { opacity: 0, scale: 0.95 };
const MOTION = { duration: 0.3 };

// A wishlist grid cell: the product card plus an explicit remove button.
// Must be a direct child of AnimatePresence so the exit animation runs.
export default function WishlistItem({ product, onRemove, reduceMotion }) {
  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : EXIT}
      transition={MOTION}
    >
      <ProductCard product={product} />
      <button
        type="button"
        onClick={() => onRemove(product)}
        aria-label={`Remove ${product.title} from wishlist`}
        className="mt-2 flex min-h-11 items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-ink"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Remove
      </button>
    </motion.li>
  );
}