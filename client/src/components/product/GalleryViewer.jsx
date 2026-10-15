import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCT_IMAGE_SIZE } from "../../data/productContent";
import { cx } from "../../utils/cx";
import { transitions } from "../../utils/motion";

const FADE = transitions.base;

// Tablet: big image + thumbnails below. Desktop: vertical thumbnails + hover zoom.
export default function GalleryViewer({ images, title, vertical }) {
  const [active, setActive] = useState(0);
  const imageRef = useRef(null);
  const current = images[active];

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (imageRef.current) imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className={cx("flex gap-4", vertical ? "flex-row-reverse" : "flex-col")}>
      <div
        onMouseMove={handleMove}
        className="group relative aspect-4/5 flex-1 cursor-zoom-in overflow-hidden rounded-lg bg-neutral-100"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={current.url}
            ref={imageRef}
            src={current.url}
            alt={`${title} – image ${active + 1}`}
            width={PRODUCT_IMAGE_SIZE.width}
            height={PRODUCT_IMAGE_SIZE.height}
            fetchPriority={active === 0 ? "high" : "auto"}
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-150 motion-reduce:transition-none"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className={cx("flex gap-3", vertical ? "flex-col" : "flex-row overflow-x-auto")}>
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              className={cx(
                "h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                index === active ? "border-ink" : "border-transparent hover:border-neutral-300"
              )}
            >
              <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}