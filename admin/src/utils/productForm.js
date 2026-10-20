// Conversion between the API product and the form (all form values are strings
// or booleans; numbers are only produced when the FormData is built).

// Backend contract: discountPrice "0" means "no discount" (lets edits clear a discount).
const NO_DISCOUNT_VALUE = "0";

export const createEmptyVariant = () => ({ size: "", color: "", stock: "0" });

const createEmptyFormValues = () => ({
  title: "",
  description: "",
  brand: "",
  category: "",
  price: "",
  discountPrice: "",
  isActive: true,
  isFeatured: false,
  variants: [createEmptyVariant()],
});

const toVariantValues = (variant) => ({
  size: variant.size ?? "",
  color: variant.color ?? "",
  stock: String(variant.stock ?? 0),
});

export const toFormValues = (product) => {
  if (!product) return createEmptyFormValues();

  const variants = (product.variants ?? []).map(toVariantValues);
  return {
    title: product.title ?? "",
    description: product.description ?? "",
    brand: product.brand ?? "",
    category: product.category ?? "",
    price: String(product.price ?? ""),
    discountPrice: Number(product.discountPrice) > 0 ? String(product.discountPrice) : "",
    isActive: product.isActive ?? true,
    isFeatured: product.isFeatured ?? false,
    variants: variants.length > 0 ? variants : [createEmptyVariant()],
  };
};

// values: validated form values. files: new File objects. removeImages: publicIds to delete.
export const buildProductFormData = (values, { files = [], removeImages = [] } = {}) => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("brand", values.brand);
  formData.append("category", values.category);
  formData.append("price", String(Number(values.price)));
  formData.append(
    "discountPrice",
    values.discountPrice === "" ? NO_DISCOUNT_VALUE : String(Number(values.discountPrice))
  );
  formData.append("isActive", String(values.isActive));
  formData.append("isFeatured", String(values.isFeatured));
  formData.append(
    "variants",
    JSON.stringify(
      values.variants.map(({ size, color, stock }) => ({ size, color, stock: Number(stock) }))
    )
  );

  files.forEach((file) => formData.append("images", file));
  removeImages.forEach((publicId) => formData.append("removeImages", publicId));

  return formData;
};