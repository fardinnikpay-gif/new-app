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

export const CATEGORY_LABELS = { men: "Men", women: "Women", kids: "Kids" };

export const PRODUCT_LIMITS = { title: 120, brand: 60, description: 2000, variantText: 30 };

// Suggestions only (shown in a datalist); any text is still accepted.
export const SIZE_SUGGESTIONS = [
  "XS", "S", "M", "L", "XL", "XXL",
  "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y", "14Y",
];
export const COLOR_SUGGESTIONS = [
  "black", "white", "gray", "navy", "blue", "red", "green",
  "beige", "brown", "pink", "yellow", "orange", "purple",
];

export const COUPON_TYPES = ["percent", "fixed"];
export const COUPON_TYPE_LABELS = { percent: "Percentage", fixed: "Fixed amount" };
export const COUPON_LIMITS = { codeMin: 3, codeMax: 20, percentMin: 1, percentMax: 100 };