import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Badge from "../ui/Badge";

// Local preview for a not-yet-uploaded File; the object URL is released on cleanup.
function usePreviewUrl(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

// Pass `src` for a saved image or `file` for a new one.
export default function ImageTile({ src, file, label, isMain = false, onRemove }) {
  const previewUrl = usePreviewUrl(file);
  const imageSrc = file ? previewUrl : src;

  return (
    <li className="relative">
      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="size-full object-cover" />
        ) : (
          <ImagePlaceholder className="size-full" />
        )}
      </div>
      {isMain && (
        <span className="absolute left-1.5 top-1.5">
          <Badge tone="primary">Main</Badge>
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="absolute right-1.5 top-1.5 rounded-full bg-white p-1.5 text-gray-600 shadow-card hover:text-danger"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </li>
  );
}