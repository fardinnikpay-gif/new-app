import { measureTips } from "../data/sizeGuide";
import Seo from "../components/common/Seo";
import PageHeader from "../components/common/PageHeader";
import SizeChart from "../components/product/SizeChart";
import Reveal from "../components/motion/Reveal";
import Container from "../components/ui/Container";

const TIP_STAGGER_S = 0.1;

export default function SizeGuide() {
  return (
    <>
      <Seo title="Size guide" description="Size charts for men, women and kids in cm and inches." />
      <Container className="pb-16 md:pb-24">
        <PageHeader
          eyebrow="Help"
          title="Size guide"
          subtitle="Find your fit with our measurement tables for men, women and kids."
        />

        <Reveal>
          <SizeChart />
        </Reveal>

        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl font-light tracking-tight text-ink md:text-3xl">How to measure</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {measureTips.map((tip, index) => (
              <Reveal
                key={tip.title}
                as="li"
                delay={index * TIP_STAGGER_S}
                className="rounded-lg border border-neutral-200 p-6"
              >
                <h3 className="font-medium text-ink">{tip.title}</h3>
                <p className="mt-2 text-neutral-600">{tip.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}