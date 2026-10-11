import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CART_BUMP_EVENT,
  CART_STORAGE_KEY,
  findVariant,
  getTotalCount,
  makeCartKey,
  readStoredCart,
  writeStoredCart,
} from "../utils/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const itemsRef = useRef(items); // always the latest items, even between two calls in one tick

  // commit(next) | updates ref, state and localStorage; announces a changed counter for the bump animation
  const commit = useCallback((next) => {
    const countChanged = getTotalCount(next) !== getTotalCount(itemsRef.current);
    itemsRef.current = next;
    setItems(next);
    writeStoredCart(next);
    if (countChanged) window.dispatchEvent(new CustomEvent(CART_BUMP_EVENT));
  }, []);

  // keep several tabs in sync
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== CART_STORAGE_KEY) return;
      const next = readStoredCart();
      itemsRef.current = next;
      setItems(next);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // addItem(product, size, color, qty) | out: { ok, qty?, clamped?, max?, reason? }
  // reason: "unavailable" | "invalid_qty" | "max_reached". The caller decides about toasts.
  const addItem = useCallback(
    (product, size, color, qty = 1) => {
      const variant = findVariant(product, size, color);
      const amount = Math.floor(qty);

      if (!variant || variant.stock <= 0) return { ok: false, reason: "unavailable" };
      if (!(amount >= 1)) return { ok: false, reason: "invalid_qty" };

      const key = makeCartKey(product._id, size, color);
      const current = itemsRef.current;
      const existing = current.find((item) => item.key === key);
      const currentQty = existing?.qty ?? 0;

      if (currentQty >= variant.stock) return { ok: false, reason: "max_reached", max: variant.stock };

      const nextQty = Math.min(currentQty + amount, variant.stock);
      const display = {
        price: product.price,
        discountPrice: product.discountPrice ?? null,
        maxQty: variant.stock,
        qty: nextQty,
      };

      const next = existing
        ? current.map((item) => (item.key === key ? { ...item, ...display } : item))
        : [
            ...current,
            {
              key,
              productId: product._id,
              slug: product.slug,
              title: product.title,
              image: product.images?.[0]?.url ?? null,
              size,
              color,
              ...display,
            },
          ];

      commit(next);
      return { ok: true, qty: nextQty, clamped: currentQty + amount > variant.stock, max: variant.stock };
    },
    [commit]
  );

  const updateQty = useCallback(
    (key, qty) => {
      const current = itemsRef.current;
      const target = current.find((item) => item.key === key);
      const amount = Math.floor(qty);

      if (!target) return { ok: false, reason: "not_found" };
      if (!Number.isFinite(amount)) return { ok: false, reason: "invalid_qty" };

      const nextQty = Math.min(target.maxQty, Math.max(1, amount));
      if (nextQty !== target.qty) {
        commit(current.map((item) => (item.key === key ? { ...item, qty: nextQty } : item)));
      }
      return { ok: true, qty: nextQty, clamped: amount > target.maxQty };
    },
    [commit]
  );

  const removeItem = useCallback(
    (key) => {
      const current = itemsRef.current;
      const next = current.filter((item) => item.key !== key);
      if (next.length !== current.length) commit(next);
    },
    [commit]
  );

  const clearCart = useCallback(() => {
    if (itemsRef.current.length > 0) commit([]);
  }, [commit]);

  const totalCount = useMemo(() => getTotalCount(items), [items]);

  // isReady is always true: storage is read synchronously on first render, so there is no empty-cart flash.
  const value = useMemo(
    () => ({ items, isReady: true, totalCount, addItem, removeItem, updateQty, clearCart }),
    [items, totalCount, addItem, removeItem, updateQty, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}