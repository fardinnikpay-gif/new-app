import cloudinary from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

export const UPLOAD_FOLDERS = {
  products: "clothing-store/products",
  categories: "clothing-store/categories",
};

const toDataUri = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploadOne = async (file) => {
  const result = await cloudinary.uploader.upload(toDataUri(file), {
    folder: FOLDER,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

export const uploadImages = async (files = []) => {
  const results = await Promise.allSettled(files.map(uploadOne));
  const uploaded = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  if (uploaded.length !== files.length) {
    // Roll back the ones that did upload so no orphan images stay in Cloudinary
    await Promise.allSettled(uploaded.map((img) => deleteImage(img.publicId)));
    throw new ApiError(502, "Image upload failed, please try again");
  }
  return uploaded;
};