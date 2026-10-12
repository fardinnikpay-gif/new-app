import { Link } from "react-router-dom";
import { getBrands } from "../../api/productApi";
import useAsync from "../../hooks/useAsync";
import { cx } from "../../utils/cx";
import Container from "../ui/Container";
import ErrorState from "../ui/ErrorState";
import Skeleton from "../ui/Skeleton";

const MIN_ITEMS = 8; // repeat short lists so one copy always fills the screen

function MarqueeList({ items, hidden }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cx("flex shrink-0 items-center", hidden && "motion-reduce:hidden")}
    >
      {items.map((brand, index) => (
        <li key={`${brand}-${index}`} className="flex items-center">
          <Link
            to={`/shop?brand=${encodeURIComponent(brand)}`}
            tabIndex={hidden ? -1 : undefined}
            className="px-6 py-2 text-3xl font-light tracking-tight text-neutral-400 transition-colors hover:text-ink md:px-10 md:text-5xl"
          >
            {brand}
          </Link>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );
}

export default function BrandsMarquee() {
  const { data, loading, error, reload } = useAsync(() => getBrands(), []);

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <Container>
          <Skeleton className="h-16 w-full" />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-12">
        <Container>
          <ErrorState message={error.message} onRetry={reload} />
        </Container>
      </section>
    );
  }

  const brands = (data?.brands ?? [])
    .map((brand) => (typeof brand === "string" ? brand : brand?.name))
    .filter(Boolean);

  if (!brands.length) return null; // empty state: the strip simply isn't shown

  const repeat = Math.max(1, Math.ceil(MIN_ITEMS / brands.length));
  const items = Array.from({ length: repeat }).flatMap(() => brands);

  return (
    <section aria-label="Brands" className="overflow-hidden border-y border-neutral-200 py-8 md:py-12">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        <MarqueeList items={items} />
        <MarqueeList items={items} hidden />
      </div>
    </section>
  );
}