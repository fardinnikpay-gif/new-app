import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { cx } from "../../utils/cx";
import Button from "../ui/Button";

const SWAP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

export default function AddToCartButton({ status, soldOut, onClick, size = "lg", className }) {
  const success = status === "success";
  let label = "Add to cart";
  if (soldOut) label = "Out of stock";
  if (success) label = "Added to cart";

  return (
    <Button size={size} onClick={onClick} disabled={soldOut} className={cx("w-full", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          aria-live="polite"
          className="flex items-center justify-center gap-2"
          {...SWAP}
        >
          {success ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            !soldOut && <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          )}
          {label}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}