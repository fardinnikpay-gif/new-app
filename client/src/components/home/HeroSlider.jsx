import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { heroSlides } from "../../data/heroSlides";
import useMediaQuery from "../../hooks/useMediaQuery";
import useHeroScroll from "../../hooks/useHeroScroll";
import HeroSlide from "./HeroSlide";
import HeroPagination from "./HeroPagination";

const AUTOPLAY_DELAY_MS = 6000;
const FADE_SPEED_MS = 900;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function HeroSlider() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const swiperRef = useRef(null);
  const progressRef = useRef(null);

  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycles, setCycles] = useState(() => heroSlides.map(() => 0));
  const [playing, setPlaying] = useState(true);

  useHeroScroll({ sectionRef, innerRef }, reducedMotion);

  const handleSwiper = useCallback((swiper) => {
    swiperRef.current = swiper;
    setActiveIndex(swiper.realIndex);
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    const next = swiper.realIndex;
    setActiveIndex(next);
    setCycles((prev) => prev.map((c, i) => (i === next ? c + 1 : c)));
  }, []);

  // progress goes 1 -> 0 while the autoplay timer runs
  const handleProgress = useCallback((_swiper, _timeLeft, progress) => {
    const el = progressRef.current;
    if (el) el.style.transform = `scaleX(${1 - progress})`;
  }, []);

  const handleSelect = useCallback((index) => swiperRef.current?.slideTo(index), []);

  const handleTogglePlay = useCallback(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (playing) autoplay.stop();
    else autoplay.start();
    setPlaying((value) => !value);
  }, [playing]);

  const autoplay = reducedMotion
    ? false
    : { delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false, pauseOnMouseEnter: true };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative z-0 h-[calc(100svh-var(--spacing-header))] overflow-hidden bg-ink md:h-svh"
    >
      <div ref={innerRef} className="absolute inset-0">
        <Swiper
          key={reducedMotion ? "static" : "auto"}
          className="h-full"
          modules={[A11y, Autoplay, EffectFade, Keyboard]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={FADE_SPEED_MS}
          rewind
          keyboard={{ enabled: true }}
          autoplay={autoplay}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          onAutoplayTimeLeft={handleProgress}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <HeroSlide slide={slide} index={index} cycle={cycles[index]} />
            </SwiperSlide>
          ))}
        </Swiper>

        <HeroPagination
          count={heroSlides.length}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          progressRef={progressRef}
          animated={!reducedMotion && playing}
          showToggle={!reducedMotion}
          playing={playing}
          onTogglePlay={handleTogglePlay}
        />
      </div>
    </section>
  );
}