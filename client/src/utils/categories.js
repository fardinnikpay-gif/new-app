import {
  CATEGORY_FALLBACK_IMAGE,
  CATEGORY_ORDER,
  categoryPlaceholders,
} from "../data/homeContent";

export const getCategoryKey = (category) =>
  String(category.slug ?? category.name ?? "").toLowerCase();

export const getCategoryLabel = (category) => category.name ?? getCategoryKey(category);

export const getCategoryImage = (category) => {
  const image = typeof category.image === "string" ? category.image : category.image?.url;
  return image || categoryPlaceholders[getCategoryKey(category)] || CATEGORY_FALLBACK_IMAGE;
};

export const sortCategories = (categories) => {
  const rank = (category) => {
    const index = CATEGORY_ORDER.indexOf(getCategoryKey(category));
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return [...categories].sort((a, b) => rank(a) - rank(b));
};