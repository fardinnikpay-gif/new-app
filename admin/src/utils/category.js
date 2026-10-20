import { CATEGORIES, CATEGORY_LABELS } from "./constants";

// The three shop categories are men/women/kids. Match by slug first, then by name.
const getKey = (category) => String(category?.slug ?? category?.name ?? "").toLowerCase();

export const getCategoryLabel = (category) =>
  CATEGORY_LABELS[getKey(category)] ?? category?.name ?? "Category";

export const getCategoryImage = (category) => {
  const image = category?.image;
  if (typeof image === "string") return image || null;
  return image?.url ?? null;
};

// Fixed order (men, women, kids); anything unexpected goes last.
const rank = (category) => {
  const index = CATEGORIES.indexOf(getKey(category));
  return index === -1 ? CATEGORIES.length : index;
};

export const sortCategories = (categories = []) =>
  [...categories].sort((a, b) => rank(a) - rank(b));