import Category, { CATEGORY_NAMES } from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadImages, deleteImage, UPLOAD_FOLDERS } from "./uploadService.js";

/** Always in the fixed storefront order (men, women, kids), whatever the insertion order was. */
export const listAll = async () => {
  const categories = await Category.find();
  return categories.sort((a, b) => CATEGORY_NAMES.indexOf(a.name) - CATEGORY_NAMES.indexOf(b.name));
};

export const getById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

/**
 * Order matters: upload the new file, save, and only then delete the old one,
 * so a failure at any point never leaves the category without a working image.
 */
export const updateImage = async (id, file) => {
  const category = await getById(id);
  if (!file) throw new ApiError(400, "Image file is required (field name: image)");

  const [newImage] = await uploadImages([file], UPLOAD_FOLDERS.categories);
  const oldPublicId = category.image?.publicId;

  category.image = newImage;
  try {
    await category.save();
  } catch (err) {
    await deleteImage(newImage.publicId); // do not leave the new file orphaned
    throw err;
  }

  await deleteImage(oldPublicId);
  return category;
};