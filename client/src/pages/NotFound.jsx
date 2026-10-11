import { Link } from "react-router-dom";
import Seo from "../components/common/Seo";
import TextReveal from "../components/motion/TextReveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

export default function NotFound() {
  return (
    <Container as="section" className="grid min-h-[60vh] place-items-center py-16">
      <Seo title="Page not found" noindex />
      <div className="space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">404</p>
        <TextReveal as="h1" text="This page could not be found" className="text-4xl md:text-6xl" />
        <p className="mx-auto max-w-md text-neutral-500">
          The link may be broken, or the page may have been removed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/">
            Back to home
          </Button>
          <Button as={Link} to="/shop" variant="outline">
            Browse the shop
          </Button>
        </div>
      </div>
    </Container>
  );
}