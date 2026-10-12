import { Link } from "react-router-dom";
import { HERO_IMAGE_SIZE } from "../../data/heroSlides";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Reveal from "../motion/Reveal";
import TextReveal from "../motion/TextReveal";

const TITLE_STAGGER_S = 0.08;
const DELAY_S = { eyebrow: 0.1, subtitle: 0.5, cta: 0.7 };

// `cycle` changes only when this slide becomes active, so the text reveal replays on activation.
export default function HeroSlide({ slide, index, cycle }) {
  const isFirst = index === 0;

  return (
    <div className="relative h-full w-full">
      <div data-hero-parallax className="absolute inset-0">
        <img
          src={slide.image.src}
          alt={slide.image.alt}
          width={HERO_IMAGE_SIZE.width}
          height={HERO_IMAGE_SIZE.height}
          loading="eager"
          decoding="async"
          fetchPriority={isFirst ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-ink/30"
      />

      <div className="relative z-10 flex h-full items-end pb-28 md:pt-header md:pb-32">
        <Container>
          <div key={cycle} className="max-w-2xl text-white">
            <Reveal
              as="p"
              delay={DELAY_S.eyebrow}
              className="mb-4 text-sm uppercase tracking-widest text-accent"
            >
              {slide.eyebrow}
            </Reveal>

            <TextReveal
              as={isFirst ? "h1" : "h2"}
              text={slide.title}
              stagger={TITLE_STAGGER_S}
              className="text-4xl font-light leading-tight tracking-tight md:text-6xl lg:text-7xl"
            />

            <Reveal
              as="p"
              delay={DELAY_S.subtitle}
              className="mt-5 max-w-md text-base text-white/80 md:text-lg"
            >
              {slide.subtitle}
            </Reveal>

            <Reveal delay={DELAY_S.cta} className="mt-8">
              <Button as={Link} to={slide.cta.to} size="lg">
                {slide.cta.label}
              </Button>
            </Reveal>
          </div>
        </Container>
      </div>
    </div>
  );
}