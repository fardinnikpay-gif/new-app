import Reveal from "../motion/Reveal";

const DELAY_S = { title: 0.1, subtitle: 0.2 };

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="max-w-3xl pb-8 pt-8 md:pb-12 md:pt-12">
      {eyebrow && (
        <Reveal as="p" className="mb-3 text-sm uppercase tracking-widest text-primary-strong">
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h1" delay={DELAY_S.title} className="text-4xl font-light tracking-tight text-ink md:text-6xl">
        {title}
      </Reveal>
      {subtitle && (
        <Reveal as="p" delay={DELAY_S.subtitle} className="mt-4 text-lg text-neutral-600">
          {subtitle}
        </Reveal>
      )}
    </header>
  );
}