import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, MAX_PRODUCT_IMAGES } from "../../utils/constants";
import { cx } from "../../utils/cx";
import { MAX_IMAGE_MB, getFileKey, validateImageFiles } from "../../utils/images";
import ImageTile from "./ImageTile";

// existing: saved images still kept [{url, publicId}]; files: new File objects.
// The first image (saved ones first) is the main image.
export default function ImageUploader({
  existing = [],
  files = [],
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  max = MAX_PRODUCT_IMAGES,
  showMain = true,
}) {
  const [errors, setErrors] = useState([]);
  const [dragging, setDragging] = useState(false);

  const total = existing.length + files.length;
  const remaining = Math.max(max - total, 0);
  const full = remaining === 0;

  const handleFiles = (fileList) => {
    const { valid, errors: found } = validateImageFiles(Array.from(fileList), {
      currentFiles: files,
      remainingSlots: remaining,
      max,
    });
    setErrors(found);
    if (valid.length > 0) onAdd(valid);
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = ""; // lets the same file be picked again later
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!full) setDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!full) handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <label
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cx(
          "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
          full
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : "cursor-pointer text-gray-600",
          !full && (dragging ? "border-primary bg-primary/5" : "border-gray-300 hover:bg-gray-50")
        )}
      >
        <input
          type="file"
          multiple
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          disabled={full}
          onChange={handleInputChange}
          className="sr-only"
        />
        <ImagePlus className="size-8" aria-hidden="true" />
        <span className="text-sm font-medium">
          {full ? "Image limit reached" : "Drag images here or click to browse"}
        </span>
        <span className="text-xs text-gray-500">
          JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB each · {total}/{max} images
        </span>
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-danger">
          {errors.map((message, index) => (
            <li key={`${message}-${index}`}>{message}</li>
          ))}
        </ul>
      )}

      {total > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {existing.map((image, index) => (
            <ImageTile
              key={image.publicId}
              src={image.url}
              label={`Image ${index + 1}`}
              isMain={showMain && index === 0}
              onRemove={() => onRemoveExisting(image.publicId)}
            />
          ))}
          {files.map((file, index) => (
            <ImageTile
              key={getFileKey(file)}
              file={file}
              label={file.name}
              isMain={showMain && existing.length === 0 && index === 0}
              onRemove={() => onRemoveNew(file)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}