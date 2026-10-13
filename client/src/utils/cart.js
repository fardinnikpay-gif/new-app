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


import { MAX_QTY_DEFAULT, PRODUCT_IMAGE_FALLBACK } from "../data/productContent";

// The preview response shape is handled defensively (see the field names read below).
export const getProductId = (entry) =>
  entry.productId ?? entry.product?._id ?? entry.product ?? entry._id;

export const lineKey = (entry) => `${getProductId(entry)}|${entry.size}|${entry.color}`;

export const toPreviewItems = (items) =>
  items.map((item) => ({
    productId: getProductId(item),
    size: item.size,
    color: item.color,
    qty: item.qty,
  }));

export const getItemImage = (item) =>
  (typeof item.image === "string" ? item.image : item.image?.url) || PRODUCT_IMAGE_FALLBACK;

export const getItemUnitPrice = (item) =>
  item.discountPrice != null && item.discountPrice < item.price ? item.discountPrice : item.price;

// Matches a cart item to its preview line by product/size/color, falling back to position.
export const findLine = (pricing, item, index, count) => {
  const lines = pricing?.lineItems ?? [];
  const key = lineKey(item);
  return lines.find((line) => lineKey(line) === key) ?? (lines.length === count ? lines[index] : undefined);
};

// Server values win; local values are only for instant display.
export const getLineAmounts = (line, item) => {
  const unit = line?.unitPrice ?? line?.price ?? getItemUnitPrice(item);
  const total = line?.lineTotal ?? line?.total ?? unit * item.qty;
  return { unit, total };
};

export const getMaxQty = (item, line) =>
  Math.max(1, line?.available ?? line?.stock ?? item.stock ?? MAX_QTY_DEFAULT);

const describeIssue = (line, item) => {
  if (line.isActive === false || line.active === false || line.unavailable === true) {
    return { type: "inactive", message: "This item is no longer available." };
  }
  const available = line.available ?? line.stock;
  if (typeof available === "number" && available < item.qty) {
    return available > 0
      ? { type: "stock", available, message: `Only ${available} left in stock.` }
      : { type: "stock", available: 0, message: "This item is out of stock." };
  }
  const text = line.error ?? line.issue;
  return typeof text === "string" && text ? { type: "error", message: text } : null;
};

// Returns [{ key, type: "inactive" | "stock" | "error", message, available? }].
export const extractIssues = (items, pricing) =>
  items.flatMap((item, index) => {
    const line = findLine(pricing, item, index, items.length);
    const issue = line ? describeIssue(line, item) : null;
    return issue ? [{ key: item.key, ...issue }] : [];
  });