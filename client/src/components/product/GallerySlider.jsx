import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";
import { PRODUCT_IMAGE_SIZE } from "../../data/productContent";
import { cx } from "../../utils/cx";

// Phone gallery: swipeable slides with custom bullets.
export default function GallerySlider({ images, title }) {
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);

  return (
    <div>
      <Swiper
        modules={[A11y]}
        className="overflow-hidden rounded-lg"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActive(swiper.activeIndex)}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.url}>
            <div className="aspect-4/5 bg-neutral-100">
              <img
                src={image.url}
                alt={`${title} – image ${index + 1}`}
                width={PRODUCT_IMAGE_SIZE.width}
                height={PRODUCT_IMAGE_SIZE.height}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <div className="mt-2 flex justify-center">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => swiperRef.current?.slideTo(index)}
              className="flex h-11 w-7 items-center justify-center"
            >
              <span
                className={cx(
                  "h-2 w-2 rounded-full transition-colors",
                  index === active ? "bg-ink" : "bg-neutral-300"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}