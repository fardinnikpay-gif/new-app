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

// Keep equal to Tailwind's `lg` breakpoint (64rem).
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const SIDEBAR_STORAGE_KEY = "admin:sidebar-collapsed";
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Store";

export const DASHBOARD_LIST_LIMIT = 5;
export const ORDER_NUMBER_LENGTH = 8;

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};