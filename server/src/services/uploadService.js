import cloudinary from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

export const UPLOAD_FOLDERS = {
  products: "clothing-store/products",
  categories: "clothing-store/categories",
};

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      // Cloudinary re-checks the real format, on top of our own signature check
      { folder, resource_type: "image", allowed_formats: ["jpg", "png", "webp"] },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

/**
 * Best-effort delete: a leftover file on Cloudinary must never fail the request
 * that made it obsolete, so errors are logged and swallowed.
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  } catch (err) {
    console.error(`Could not delete image ${publicId}: ${err.message}`);
  }
};

/**
 * Uploads multer memory files in parallel and returns [{ url, publicId }] in the same order.
 * If any upload fails, the ones that succeeded are deleted again (no orphan files).
 */
export const uploadImages = async (files, folder = UPLOAD_FOLDERS.products) => {
  const results = await Promise.allSettled(files.map((file) => uploadBuffer(file.buffer, folder)));

  const uploaded = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const failure = results.find((r) => r.status === "rejected");

  if (failure) {
    await Promise.all(uploaded.map((image) => deleteImage(image.publicId)));
    console.error(`Image upload failed: ${failure.reason?.message}`);
    throw new ApiError(502, "Image upload failed, please try again");
  }
  return uploaded;
};