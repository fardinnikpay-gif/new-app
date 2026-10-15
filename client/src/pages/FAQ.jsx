import { Link } from "react-router-dom";
import { faqGroups } from "../data/faq";
import Seo from "../components/common/Seo";
import FaqAccordion from "../components/common/FaqAccordion";
import PageHeader from "../components/common/PageHeader";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

const GROUP_STAGGER_S = 0.05;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups
    .flatMap((group) => group.items)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
};

export default function FAQ() {
  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about delivery, returns, payment and sizing."
        jsonLd={jsonLd}
      />
      <Container className="pb-16 md:pb-24">
        <PageHeader
          eyebrow="Help"
          title="Frequently asked questions"
          subtitle="Can't find your answer? Contact us and we'll get back to you."
        />

        <div className="max-w-3xl space-y-12">
          {faqGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * GROUP_STAGGER_S}>
              <h2 className="mb-4 text-2xl font-light tracking-tight text-ink">{group.title}</h2>
              <FaqAccordion items={group.items} />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4">
          <p className="text-neutral-600">Still need help?</p>
          <Button as={Link} to="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </Container>
    </>
  );
}