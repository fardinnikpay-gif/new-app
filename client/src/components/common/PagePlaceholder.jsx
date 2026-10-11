import Container from "../ui/Container";
import TextReveal from "../motion/TextReveal";
import Seo from "./Seo";

// Temporary page body used until each page is built in its own step.
export default function PagePlaceholder({ title, children }) {
  return (
    <Container as="section" className="space-y-6 py-16">
      <Seo title={title} noindex />
      <TextReveal as="h1" text={title} className="text-4xl md:text-6xl" />
      <p className="text-neutral-500">This page is a placeholder and will be built in a later step.</p>
      {children}
    </Container>
  );
}