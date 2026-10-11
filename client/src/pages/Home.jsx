import Seo from "../components/common/Seo";
import Container from "../components/ui/Container";

export default function Home() {
  return (
    <>
      <Seo />
      <section className="-mt-[var(--header-height)] grid min-h-[80vh] place-items-center bg-ink pt-[var(--header-height)] text-surface">
        <p className="text-4xl font-light">Hero placeholder</p>
      </section>
      <Container className="space-y-6 py-16">
        <p className="text-neutral-600">Scroll to test the header, the progress bar and the back-to-top button.</p>
        <div className="h-[200vh] rounded-lg border border-dashed border-line-strong" />
      </Container>
    </>
  );
}