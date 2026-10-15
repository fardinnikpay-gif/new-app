import { useEffect, useMemo, useRef } from "react";
import { getBrands, getProducts } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import useAsync from "../hooks/useAsync";
import useMediaQuery from "../hooks/useMediaQuery";
import useShopFilters from "../hooks/useShopFilters";
import { useLenis } from "../components/motion/SmoothScroll";
import { CATEGORY_ORDER } from "../data/homeContent";
import { PAGE_SIZE } from "../data/shopFilters";
import { sortCategories } from "../utils/categories";
import { getShopDescription, getShopTitle, toProductParams } from "../utils/shopQuery";
import Seo from "../components/common/Seo";
import Pagination from "../components/common/Pagination";
import Reveal from "../components/motion/Reveal";
import ActiveFilterChips from "../components/product/ActiveFilterChips";
import FilterSidebar from "../components/product/FilterSidebar";
import MobileFilters from "../components/product/MobileFilters";
import ProductGrid from "../components/product/ProductGrid";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import SortSelect from "../components/product/SortSelect";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import useScrollShift from "../hooks/useScrollShift";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL_OFFSET_PX = 96; // header height + breathing room
const TITLE_SHIFT = { y: 24, opacity: 0.4, end: "+=300" };

// Used when GET /categories fails, so the sidebar still works.
const FALLBACK_CATEGORIES = CATEGORY_ORDER.map((key) => ({ slug: key, name: key }));

const toBrandName = (brand) => (typeof brand === "string" ? brand : brand?.name);

function NoResults({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <EmptyState title="No products found" />
      {hasFilters && (
        <Button variant="outline" onClick={onClear}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export default function Shop() {
  const { filters, setFilter, setFilters, clearFilters, activeCount } = useShopFilters();
  const gridRef = useRef(null);
  const isFirstRender = useRef(true);
  const lenis = useLenis();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const params = useMemo(() => toProductParams(filters, PAGE_SIZE), [filters]);
  const queryKey = JSON.stringify(params);

  const { data, loading, error, reload } = useAsync(() => getProducts(params), [queryKey]);
  const { data: brandData } = useAsync(() => getBrands(), []);
  const { data: categoryData } = useAsync(() => getCategories(), []);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const brands = (brandData?.brands ?? []).map(toBrandName).filter(Boolean);
  const loadedCategories = sortCategories(categoryData?.categories ?? []);
  const categories = loadedCategories.length ? loadedCategories : FALLBACK_CATEGORIES;

  const title = getShopTitle(filters);

  const titleRef = useRef(null);
  useScrollShift(titleRef, TITLE_SHIFT);

  // Scroll back to the top of the grid when filters/page change (only if it's out of view).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;
    const top = grid.getBoundingClientRect().top;
    if (top >= SCROLL_OFFSET_PX) return;

    if (lenis) {
      lenis.scrollTo(grid, { offset: -SCROLL_OFFSET_PX, immediate: reducedMotion });
    } else {
      window.scrollTo({
        top: window.scrollY + top - SCROLL_OFFSET_PX,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
    // only when the query changes, not when lenis/reducedMotion change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  // If the page number is beyond the last page (e.g. after filtering), go to the last page.
  useEffect(() => {
    if (data && data.pages > 0 && filters.page > data.pages) {
      setFilter("page", data.pages, { replace: true });
    }
  }, [data, filters.page, setFilter]);

  let results;
  if (loading) {
    results = <ProductGridSkeleton />;
  } else if (error) {
    results = <ErrorState message={error.message} onRetry={reload} />;
  } else if (!products.length) {
    results = <NoResults hasFilters={activeCount > 0} onClear={clearFilters} />;
  } else {
    results = (
      <>
        <ProductGrid key={queryKey} products={products} />
        <Pagination
          page={filters.page}
          pages={data.pages}
          onChange={(page) => setFilter("page", page)}
        />
      </>
    );
  }

  let countLabel = "\u00A0"; // keeps the toolbar height stable while loading
  if (!loading && !error) countLabel = `${total} ${total === 1 ? "product" : "products"}`;

  return (
    <>
      <Seo title={title} description={getShopDescription(title)} />
      <Container className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Reveal key={title} as="h1" className="mb-8 text-4xl font-light tracking-tight text-ink md:text-5xl">
          {title}
        </Reveal>

        <div ref={titleRef}>
          <Reveal key={title} as="h1" className="mb-8 text-4xl font-light tracking-tight text-ink md:text-5xl">
            {title}
          </Reveal>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-4">
            {!isDesktop && (
              <MobileFilters
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
                brands={brands}
                categories={categories}
                activeCount={activeCount}
                total={total}
              />
            )}
            <p aria-live="polite" className="text-sm text-neutral-600">
              {countLabel}
            </p>
          </div>
          <SortSelect value={filters.sort} onChange={(value) => setFilter("sort", value)} />
        </div>

        <ActiveFilterChips filters={filters} onRemove={setFilters} onClearAll={clearFilters} />

        <div className="mt-8 flex gap-12">
          {isDesktop && (
            <aside className="w-64 shrink-0">
              <div
                data-lenis-prevent
                className="sticky top-24 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2"
              >
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  brands={brands}
                  categories={categories}
                />
              </div>
            </aside>
          )}
          <div ref={gridRef} className="min-w-0 flex-1">
            {results}
          </div>
        </div>
      </Container>
    </>
  );
}