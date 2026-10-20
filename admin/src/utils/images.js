import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "./constants";

const BYTES_PER_MB = 1024 * 1024;

export const MAX_IMAGE_MB = MAX_IMAGE_SIZE_BYTES / BYTES_PER_MB;

// Identity of a picked file (also used as the React key).
export const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

// Splits picked files into accepted ones and one error message per rejected file.
export const validateImageFiles = (incoming, { currentFiles, remainingSlots, max }) => {
  const valid = [];
  const errors = [];
  const seen = new Set(currentFiles.map(getFileKey));

  for (const file of incoming) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push(`${file.name}: only JPG, PNG or WebP images are allowed`);
    } else if (file.size > MAX_IMAGE_SIZE_BYTES) {
      errors.push(`${file.name}: larger than ${MAX_IMAGE_MB} MB`);
    } else if (seen.has(getFileKey(file))) {
      errors.push(`${file.name}: already added`);
    } else if (valid.length >= remainingSlots) {
      errors.push(`${file.name}: not added, the limit is ${max} images`);
    } else {
      seen.add(getFileKey(file));
      valid.push(file);
    }
  }

  return { valid, errors };
};