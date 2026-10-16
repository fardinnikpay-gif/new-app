import { Link } from "react-router-dom";
import { PROMO_IMAGE_SIZE, promoBanner } from "../../data/homeContent";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Reveal from "../motion/Reveal";

const DELAY_S = { title: 0.1, subtitle: 0.2, cta: 0.3 };

export default function PromoBanner() {
  const { eyebrow, title, subtitle, cta, image } = promoBanner;

  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-lg bg-ink">
          <img
            src={image.src}
            alt={image.alt}
            width={PROMO_IMAGE_SIZE.width}
            height={PROMO_IMAGE_SIZE.height}
            loading="lazy"
            decoding="async"
            className="aspect-4/5 w-full object-cover md:aspect-21/9"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/50" />

          <div className="absolute inset-0 flex items-center p-6 md:p-16">
            <div className="max-w-xl text-white">
              <Reveal as="p" className="mb-3 text-sm uppercase tracking-widest text-accent">
                {eyebrow}
              </Reveal>
              <Reveal as="h2" delay={DELAY_S.title} className="text-3xl font-light tracking-tight md:text-5xl">
                {title}
              </Reveal>
              <Reveal as="p" delay={DELAY_S.subtitle} className="mt-4 text-white/90">
                {subtitle}
              </Reveal>
              <Reveal delay={DELAY_S.cta} className="mt-8">
                <Button as={Link} to={cta.to} size="lg">
                  {cta.label}
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}