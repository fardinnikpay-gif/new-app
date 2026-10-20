import { ImageOff } from "lucide-react";
import { cx } from "../../utils/cx";

// Size comes from className (e.g. "size-12"). Pass `label` only when the image is meaningful.
export default function ImagePlaceholder({ className, label }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("flex items-center justify-center bg-gray-100 text-gray-400", className)}
    >
      <ImageOff className="size-1/2" aria-hidden="true" />
    </div>
  );
}