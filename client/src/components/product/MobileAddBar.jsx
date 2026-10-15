import { AnimatePresence, motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";
import PriceTag from "./PriceTag";
import { transitions } from "../../utils/motion";

const SLIDE = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition:transitions.base,
};

// Fixed bottom bar on phones. `visible` comes from useStickyBar.
export default function MobileAddBar({ product, visible, status, soldOut, onAdd }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
          {...SLIDE}
        >
          <div className="flex items-center gap-4">
            <PriceTag price={product.price} discountPrice={product.discountPrice} />
            <AddToCartButton status={status} soldOut={soldOut} onClick={onAdd} className="flex-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}