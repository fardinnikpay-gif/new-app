import { useRef } from "react";
import { getCategories } from "../../api/categoryApi";
import useAsync from "../../hooks/useAsync";
import useMediaQuery from "../../hooks/useMediaQuery";
import useCategoryShowcaseScroll from "../../hooks/useCategoryShowcaseScroll";
import { getCategoryKey, sortCategories } from "../../utils/categories";
import Container from "../ui/Container";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import CategoryCard from "./CategoryCard";
import CategoryIntro from "./CategoryIntro";
import CategoryShowcaseSkeleton from "./CategoryShowcaseSkeleton";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HORIZONTAL_CARD = "h-[70svh] shrink-0 aspect-4/5";
const STACKED_CARD = "aspect-4/5 md:aspect-video lg:aspect-4/5";

function CategoryStatus({ loading, error, onRetry }) {
  if (loading) return <CategoryShowcaseSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;
  return <EmptyState title="No categories yet" />;
}

export default function CategoryShowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const { data, loading, error, reload } = useAsync(() => getCategories(), []);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const categories = sortCategories(data?.categories ?? []);
  const ready = !loading && !error && categories.length > 0;

  let mode = "vertical";
  if (reducedMotion) mode = "static";
  else if (isDesktop) mode = "horizontal";
  const pinned = ready && mode === "horizontal";

  useCategoryShowcaseScroll({ sectionRef, trackRef, mode, enabled: ready }, categories.length);

  if (!ready) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <CategoryStatus loading={loading} error={error} onRetry={reload} />
        </Container>
      </section>
    );
  }

  const cards = categories.map((category) => (
    <CategoryCard
      key={getCategoryKey(category)}
      category={category}
      className={pinned ? HORIZONTAL_CARD : STACKED_CARD}
    />
  ));

  if (pinned) {
    return (
      <section ref={sectionRef} aria-label="Shop by category" className="flex h-svh items-center overflow-hidden">
        <div ref={trackRef} className="flex w-max items-center gap-8 px-8">
          <CategoryIntro className="w-[30vw] shrink-0" />
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Shop by category" className="py-16 md:py-24">
      <Container>
        <CategoryIntro className="mb-10 max-w-xl md:mb-14" />
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">{cards}</div>
      </Container>
    </section>
  );
}