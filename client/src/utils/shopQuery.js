const TEXT_KEYS = ["category", "brand", "size", "color", "minPrice", "maxPrice", "search"];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Builds the GET /products params, skipping empty filters.
export const toProductParams = (filters, limit) => {
  const params = { page: filters.page, limit, sort: filters.sort };
  TEXT_KEYS.forEach((key) => {
    if (filters[key]) params[key] = filters[key];
  });
  if (filters.onSale) params.onSale = true;
  return params;
};

export const getShopTitle = (filters) => {
  if (filters.search) return `Results for “${filters.search}”`;
  if (filters.category) return capitalize(filters.category);
  if (filters.onSale) return "Sale";
  return "All products";
};

export const getShopDescription = (title) =>
  `Browse ${title.toLowerCase()} — filter by brand, size, colour and price.`;