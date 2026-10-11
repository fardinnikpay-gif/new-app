import { safeGet, safeSet } from "./storage";

export const CART_STORAGE_KEY = "cart:v1";
export const CART_BUMP_EVENT = "cart:bump";

// makeCartKey(productId, size, color) | out: string used as the unique item key
export const makeCartKey = (productId, size, color) => `${productId}|${size}|${color}`;

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.key === "string" &&
    typeof item.productId === "string" &&
    typeof item.size === "string" &&
    typeof item.color === "string" &&
    Number.isInteger(item.qty) &&
    item.qty > 0 &&
    Number.isInteger(item.maxQty) &&
    item.maxQty > 0
  );
}

// readStoredCart() | out: valid items only | errors: blocked storage or corrupted JSON -> []
export function readStoredCart() {
  const stored = safeGet(CART_STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.filter(isValidItem) : [];
}

export const writeStoredCart = (items) => safeSet(CART_STORAGE_KEY, items);

export const getTotalCount = (items) => items.reduce((sum, item) => sum + item.qty, 0);

// findVariant(product, size, color) | out: variant or null
export const findVariant = (product, size, color) =>
  product.variants?.find((variant) => variant.size === size && variant.color === color) ?? null;