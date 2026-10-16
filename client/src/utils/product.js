const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

// isOnSale(price, discountPrice) | a discount counts only when it is positive and below the normal price
export const isOnSale = (price, discountPrice) =>
  Number(discountPrice) > 0 && Number(discountPrice) < Number(price);

// getDiscountPercent(price, discountPrice) | out: whole percent (e.g. 21), or 0 without a valid discount
export function getDiscountPercent(price, discountPrice) {
  if (!isOnSale(price, discountPrice)) return 0;
  return Math.round((1 - Number(discountPrice) / Number(price)) * 100);
}

function compareSizes(a, b) {
  const indexA = SIZE_ORDER.indexOf(String(a).toUpperCase());
  const indexB = SIZE_ORDER.indexOf(String(b).toUpperCase());

  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  const numberA = parseFloat(a);
  const numberB = parseFloat(b);
  if (!Number.isNaN(numberA) && !Number.isNaN(numberB) && numberA !== numberB) return numberA - numberB;

  return String(a).localeCompare(String(b));
}

// getColors(variants) | out: unique colors in order of appearance
export const getColors = (variants = []) => [...new Set(variants.map((variant) => variant.color))];

// getSizes(variants) | out: unique sizes in standard order (XS...4XL, then numeric, then alphabetical)
export const getSizes = (variants = []) => [...new Set(variants.map((variant) => variant.size))].sort(compareSizes);

// getStock(variants, size, color) | out: stock of that exact variant (0 when it does not exist)
export const getStock = (variants = [], size, color) =>
  variants.find((variant) => variant.size === size && variant.color === color)?.stock ?? 0;

// isSizeAvailable(variants, size, color?) | without a color: available if any color has stock
export const isSizeAvailable = (variants = [], size, color = null) =>
  variants.some((variant) => variant.size === size && (color === null || variant.color === color) && variant.stock > 0);

// isColorAvailable(variants, color, size?) | without a size: available if any size has stock
export const isColorAvailable = (variants = [], color, size = null) =>
  variants.some((variant) => variant.color === color && (size === null || variant.size === size) && variant.stock > 0);

// isInStock(product) | out: true when at least one variant has stock
export const isInStock = (product) => product.variants?.some((variant) => variant.stock > 0) ?? false;

const ISO_CURRENCY = /^[A-Z]{3}$/;
const SEO_DESCRIPTION_MAX = 160;

export const getEffectivePrice = (product) =>
  product.discountPrice != null && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

export const hasDiscount = (product) =>
  product.discountPrice != null && product.discountPrice < product.price;

export const getProductCategory = (product) => {
  const category = product.category;
  const value = typeof category === "string" ? category : category?.slug ?? category?.name ?? "";
  return String(value).toLowerCase();
};

const truncate = (text, max) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

export const getProductDescription = (product) => {
  const base =
    (product.description || "").replace(/\s+/g, " ").trim() ||
    `${product.brand ?? ""} ${product.title}`.trim();
  return truncate(base, SEO_DESCRIPTION_MAX);
};

// schema.org Product. priceCurrency is only added when VITE_CURRENCY is an ISO code (e.g. USD).
export const buildProductJsonLd = (product) => {
  const currency = import.meta.env.VITE_CURRENCY ?? "";
  const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
  const images = (product.images ?? []).map((image) => image.url).filter(Boolean);

  const offer = {
    "@type": "Offer",
    price: getEffectivePrice(product),
    availability:
      product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  };
  if (ISO_CURRENCY.test(currency)) offer.priceCurrency = currency;
  if (siteUrl) offer.url = `${siteUrl}/product/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(images.length > 0 && { image: images }),
    description: getProductDescription(product),
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    offers: offer,
  };
};

// schema.org BreadcrumbList. The last crumb (the current page) has no link.
export const buildBreadcrumbJsonLd = (crumbs) => {
  const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.to && siteUrl ? { item: `${siteUrl}${crumb.to}` } : {}),
    })),
  };
};