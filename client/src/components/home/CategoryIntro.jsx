import { categoryIntro } from "../../data/homeContent";
import Reveal from "../motion/Reveal";

const DELAY_S = { title: 0.1, text: 0.2 };

export default function CategoryIntro({ className }) {
  return (
    <div className={className}>
      <Reveal as="p" className="mb-3 text-sm uppercase tracking-widest text-primary">
        {categoryIntro.eyebrow}
      </Reveal>
      <Reveal as="h2" delay={DELAY_S.title} className="text-3xl font-light tracking-tight text-ink md:text-5xl">
        {categoryIntro.title}
      </Reveal>
      <Reveal as="p" delay={DELAY_S.text} className="mt-4 max-w-sm text-neutral-600">
        {categoryIntro.text}
      </Reveal>
    </div>
  );
}