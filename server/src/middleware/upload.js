import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILES = 6;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES, fields: 30, fieldSize: 100 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new ApiError(400, "Only JPG, PNG and WEBP images are allowed"));
    }
    cb(null, true);
  },
});

// The mimetype is client-supplied, so also check the real file signature
const startsWith = (buffer, bytes, offset = 0) => bytes.every((byte, i) => buffer[offset + i] === byte);

const hasImageSignature = (buffer) =>
  startsWith(buffer, [0xff, 0xd8, 0xff]) || // JPEG
  startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) || // PNG
  (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)); // WEBP

// Turns multer's own errors into 400s (otherwise they would surface as 500)
const toApiError = (err, field, maxCount) => {
  if (!(err instanceof multer.MulterError)) return err;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return new ApiError(400, "Each image must be at most 2MB");
    case "LIMIT_FILE_COUNT":
      return new ApiError(400, `You can upload at most ${maxCount} image(s)`);
    case "LIMIT_UNEXPECTED_FILE":
      return new ApiError(
        400,
        err.field === field
          ? `You can upload at most ${maxCount} image(s)`
          : `Unexpected file field "${err.field}", use "${field}"`
      );
    default:
      return new ApiError(400, err.message);
  }
};

const createUploader = (field, maxCount) => {
  const run = maxCount === 1 ? upload.single(field) : upload.array(field, maxCount);

  return (req, res, next) => {
    run(req, res, (err) => {
      if (err) return next(toApiError(err, field, maxCount));

      if (maxCount > 1) req.files ??= []; // request without files (or not multipart)
      const files = maxCount === 1 ? (req.file ? [req.file] : []) : req.files;
      if (files.some((file) => !hasImageSignature(file.buffer))) {
        return next(new ApiError(400, "Invalid image file"));
      }
      next();
    });
  };
};

/** Up to 6 images in the "images" field -> req.files[] (memory buffers). */
export const uploadImages = createUploader("images", MAX_FILES);

/** One optional image in the "image" field -> req.file (used for categories). */
export const uploadImage = createUploader("image", 1);