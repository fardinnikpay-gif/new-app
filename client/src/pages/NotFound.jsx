import { Link } from "react-router-dom";
import { CATEGORY_ORDER } from "../data/homeContent";
import Seo from "../components/common/Seo";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

const DELAY_S = { title: 0.1, text: 0.2, actions: 0.3 };

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <Container className="flex min-h-[60svh] flex-col items-center justify-center py-16 text-center">
        <Reveal as="p" className="text-8xl font-light tracking-tight text-neutral-500 md:text-9xl">
          404
        </Reveal>
        <Reveal as="h1" delay={DELAY_S.title} className="mt-4 text-3xl font-light tracking-tight text-ink md:text-4xl">
          Page not found
        </Reveal>
        <Reveal as="p" delay={DELAY_S.text} className="mt-3 max-w-md text-neutral-600">
          The page you're looking for doesn't exist or has moved.
        </Reveal>

        <Reveal delay={DELAY_S.actions} className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/">
            Back to home
          </Button>
          <Button as={Link} to="/shop" variant="outline">
            Browse the shop
          </Button>
        </Reveal>

        <nav aria-label="Popular categories" className="mt-8 flex gap-2">
          {CATEGORY_ORDER.map((key) => (
            <Link
              key={key}
              to={`/shop?category=${key}`}
              className="inline-flex min-h-11 items-center px-3 text-sm capitalize text-neutral-600 underline-offset-4 hover:text-ink hover:underline"
            >
              {key}
            </Link>
          ))}
        </nav>
      </Container>
    </>
  );
}