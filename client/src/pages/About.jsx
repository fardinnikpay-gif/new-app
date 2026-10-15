import { Link } from "react-router-dom";
import { aboutContent } from "../data/aboutContent";
import { SITE_NAME } from "../utils/site";
import Seo from "../components/common/Seo";
import PageHeader from "../components/common/PageHeader";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

const VALUE_STAGGER_S = 0.1;

export default function About() {
  const { eyebrow, subtitle, image, story, values, cta } = aboutContent;

  return (
    <>
      <Seo title="About us" description={`The story and values behind ${SITE_NAME}.`} />
      <Container className="pb-16 md:pb-24">
        <PageHeader eyebrow={eyebrow} title={`About ${SITE_NAME}`} subtitle={subtitle} />

        <Reveal className="mt-4">
          <img
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            loading="lazy"
            className="aspect-4/3 w-full rounded-lg bg-neutral-100 object-cover md:aspect-21/9"
          />
        </Reveal>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-2 lg:gap-16">
          <Reveal as="h2" className="text-3xl font-light tracking-tight text-ink md:text-4xl">
            {story.title}
          </Reveal>
          <div className="space-y-5 text-neutral-600">
            {story.paragraphs.map((text, index) => (
              <Reveal key={text} as="p" delay={index * VALUE_STAGGER_S}>
                {text}
              </Reveal>
            ))}
          </div>
        </div>

        <ul className="mt-16 grid gap-6 md:mt-24 md:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} as="li" delay={index * VALUE_STAGGER_S} className="rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-medium text-ink">{value.title}</h3>
              <p className="mt-2 text-neutral-600">{value.text}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16 flex justify-center md:mt-24">
          <Button as={Link} to={cta.to} size="lg">
            {cta.label}
          </Button>
        </div>
      </Container>
    </>
  );
}