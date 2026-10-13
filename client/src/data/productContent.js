// Static, editable content for the product page. The tab texts are sample text.
export const LOW_STOCK_THRESHOLD = 5;
export const MAX_QTY_DEFAULT = 10; // quantity cap before a size is chosen
export const SUCCESS_RESET_MS = 1800;
export const PRODUCT_IMAGE_FALLBACK = "/placeholders/category-men.svg";
export const PRODUCT_IMAGE_SIZE = { width: 800, height: 1000 };

export const productTabs = [
  { id: "description", label: "Description" },
  { id: "shipping", label: "Shipping and returns" },
  { id: "care", label: "Care" },
];

export const shippingContent = [
  {
    title: "Delivery",
    text: "Orders are dispatched within 1–2 business days. Delivery options and costs are shown at checkout.",
  },
  {
    title: "Returns",
    text: "Unworn items in their original condition can be returned within 30 days of delivery for a refund or exchange.",
  },
];

export const careContent = [
  { title: "Washing", text: "Machine wash cold with similar colours. Do not bleach." },
  { title: "Drying", text: "Tumble dry low or hang to dry. Iron on a low setting if needed." },
];