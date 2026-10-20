export const PAGE_SIZE = 10;
export const LOW_STOCK_THRESHOLD = 5;
export const MAX_PRODUCT_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_COUPON_EMAILS = 50;

export const CATEGORIES = ["men", "women", "kids"];

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// Only logical next steps are shown in the UI; the backend is the real authority.
export const ORDER_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
export const DEBOUNCE_MS = 400;