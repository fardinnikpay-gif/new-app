import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { DURATION, EASE } from "../../animations/variants";
import { useCart } from "../../context/useCart";
import useFocusTrap from "../../hooks/useFocusTrap";
import { getColors, getSizes, isColorAvailable, isInStock, isSizeAvailable } from "../../utils/product";
import Button from "../ui/Button";
import ColorSwatch from "./ColorSwatch";
import SizeSelector from "./SizeSelector";

const SLIDE_OFFSET_PX = 16;

// props: { product, onClose } | covers the image area of its card (the card must be position: relative + overflow-hidden)
// After a successful add it just closes: the cart counter bumps by itself, so there is no toast.
export default function QuickAddPopover({ product, onClose }) {
  const { addItem } = useCart();
  const panelRef = useRef(null);
  const variants = product.variants ?? [];
  const colors = getColors(variants);
  const sizes = getSizes(variants);
  const inStock = isInStock(product);

  const [color, setColor] = useState(colors.length === 1 ? colors[0] : null);
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : null);
  const [message, setMessage] = useState("");

  useFocusTrap(panelRef, onClose); // Esc closes, Tab stays inside, focus returns to the "Quick add" button

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  const handleColor = (next) => {
    setColor(next);
    setMessage("");
    if (size && !isSizeAvailable(variants, size, next)) setSize(null);
  };

  const handleSize = (next) => {
    setSize(next);
    setMessage("");
  };

  const ready = Boolean(color && size && isSizeAvailable(variants, size, color));

  let label = "Add to cart";
  if (!inStock) label = "Sold out";
  else if (!color) label = "Select a color";
  else if (!size) label = "Select a size";

  const handleAdd = () => {
    const result = addItem(product, size, color, 1);
    if (result.ok) {
      onClose();
      return;
    }
    setMessage(
      result.reason === "max_reached"
        ? `You already have all ${result.max} available in your cart.`
        : "This option is no longer available."
    );
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label={`Quick add: ${product.title}`}
      tabIndex={-1}
      initial={{ opacity: 0, y: SLIDE_OFFSET_PX }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: SLIDE_OFFSET_PX }}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      className="absolute inset-0 z-20 flex flex-col gap-2 overflow-y-auto bg-surface p-3 outline-none"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium">{product.title}</p>
        <button
          type="button"
          aria-label="Close quick add"
          onClick={onClose}
          className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors hover:bg-neutral-100"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {colors.length > 0 && (
        <div role="group" aria-label="Color" className="-ml-2 flex flex-wrap">
          {colors.map((item) => (
            <ColorSwatch
              key={item}
              color={item}
              selected={color === item}
              disabled={!isColorAvailable(variants, item, size)}
              onClick={handleColor}
            />
          ))}
        </div>
      )}

      <SizeSelector variants={variants} selectedColor={color} selectedSize={size} onSelect={handleSize} />

      {message && (
        <p role="alert" className="text-xs text-danger">
          {message}
        </p>
      )}

      <Button size="sm" className="mt-auto w-full" disabled={!inStock || !ready} onClick={handleAdd}>
        {label}
      </Button>
    </motion.div>
  );
}