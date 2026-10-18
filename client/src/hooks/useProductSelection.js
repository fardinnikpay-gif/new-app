import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/useCart";
import { LOW_STOCK_THRESHOLD, SUCCESS_RESET_MS } from "../data/productContent";

const inStock = (variant) => variant.stock > 0;
const findVariant = (variants, size, color) =>
  variants.find((variant) => variant.size === size && variant.color === color);

const getInitialColor = (variants) => (variants.find(inStock) ?? variants[0])?.color ?? "";

// If a color has exactly one size in stock, select it automatically.
const getAutoSize = (variants, color) => {
  const sizes = variants.filter((v) => v.color === color && inStock(v)).map((v) => v.size);
  return sizes.length === 1 ? sizes[0] : "";
};

// Selection state + add-to-cart logic, shared by ProductInfo and the mobile sticky bar.
export default function useProductSelection(product) {
  const { addItem } = useCart();
  const variants = useMemo(() => product.variants ?? [], [product]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);

  const [color, setColor] = useState(() => getInitialColor(variants));
  const [size, setSize] = useState(() => getAutoSize(variants, getInitialColor(variants)));
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | success
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const variant = findVariant(variants, size, color);
  const stock = variant ? variant.stock : null;
  const soldOut = variants.every((v) => !inStock(v));
  const lowStock = stock !== null && stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  const selectColor = useCallback(
    (nextColor) => {
      setColor(nextColor);
      setSize((prev) => {
        const current = findVariant(variants, prev, nextColor);
        return current && inStock(current) ? prev : getAutoSize(variants, nextColor);
      });
      setQty(1);
      setError("");
    },
    [variants]
  );

  const selectSize = useCallback((nextSize) => {
    setSize(nextSize);
    setQty(1);
    setError("");
  }, []);

  const addToCart = useCallback(() => {
    if (!size) {
      setError("Please select a size");
      return { ok: false, reason: "size" };
    }
    if (!variant || !inStock(variant)) {
      setError("This option is out of stock");
      return { ok: false, reason: "stock" };
    }

    try {
      if (addItem(product, size, color, qty) === false) {
        setError("You already have the maximum available quantity in your cart");
        return { ok: false, reason: "limit" };
      }
    } catch (err) {
      setError(err.message || "Could not add this item to your cart");
      return { ok: false, reason: "error" };
    }

    setError("");
    setStatus("success");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), SUCCESS_RESET_MS);
    return { ok: true };
  }, [addItem, color, product, qty, size, variant]);

  return {
    colors, variants, color, size, qty, variant, stock,
    soldOut, lowStock, status, error,
    selectColor, selectSize, setQty, addToCart,
  };
}