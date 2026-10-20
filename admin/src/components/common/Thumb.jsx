import { useState } from "react";
import { cx } from "../../utils/cx";
import ImagePlaceholder from "./ImagePlaceholder";

const SIZES = { sm: "size-8", md: "size-12", lg: "size-20" };

// Small image with a placeholder when src is missing or fails to load.
// alt="" (default) marks it decorative, e.g. next to the product title.
export default function Thumb({ src, alt = "", size = "md", className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const boxClass = cx("shrink-0 rounded-lg", SIZES[size], className);

  if (!src || failedSrc === src) {
    return <ImagePlaceholder label={alt || undefined} className={boxClass} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cx(boxClass, "object-cover")}
    />
  );
}