// Shop filter options and defaults. Adjust sizes/colors to match your catalog.
export const PAGE_SIZE = 12;
export const DEFAULT_SORT = "newest";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLOR_OPTIONS = [
  "black", "white", "grey", "navy", "blue", "red", "green", "beige", "brown",
];

// Filters that "Clear all" removes (sort is kept).
export const FILTER_KEYS = [
  "category", "brand", "size", "color", "minPrice", "maxPrice", "search", "onSale",
];