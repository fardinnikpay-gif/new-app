import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import { NAV_CATEGORIES, SALE_LINK } from "../../data/navigation";
import useLiveSearch, { MIN_QUERY_LENGTH } from "../../hooks/useLiveSearch";
import { cx } from "../../utils/cx";
import { formatPrice } from "../../utils/format";
import { shopUrl } from "../../utils/navigation";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import Modal from "../ui/Modal";
import Skeleton from "../ui/Skeleton";

const SKELETON_ROWS = 3;
const FALLBACK_IMAGE = "/placeholders/portrait.svg";

const POPULAR_LINKS = [
  ...NAV_CATEGORIES.map((item) => ({ label: item.label, to: shopUrl({ category: item.category }) })),
  { label: SALE_LINK.label, to: SALE_LINK.to },
];

function ResultPrice({ price, discountPrice }) {
  const onSale = discountPrice > 0 && discountPrice < price;

  return (
    <span className="shrink-0 text-right text-sm">
      {onSale ? (
        <>
          <span className="font-medium">{formatPrice(discountPrice)}</span>{" "}
          <s className="text-neutral-400">{formatPrice(price)}</s>
        </>
      ) : (
        formatPrice(price)
      )}
    </span>
  );
}

// Mounted only while the modal is open, so the text and highlight reset on every open.
function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, total, loading, error, ready, canSearch, retry } = useLiveSearch(query);

  const trimmed = query.trim();
  const allUrl = shopUrl({ search: trimmed });
  const optionCount = ready && results.length > 0 ? results.length + 1 : 0; // + "View all results"
  const activeOptionId = activeIndex >= 0 && activeIndex < optionCount ? `${listId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (activeOptionId) document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId]);

  const go = (to) => {
    onClose();
    navigate(to);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (optionCount === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % optionCount);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? optionCount - 1 : index - 1));
    }
  };

  // Enter (and the mobile "Search" key): open the highlighted product, otherwise all results
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSearch) return;
    const product = ready ? results[activeIndex] : undefined;
    go(product ? `/product/${encodeURIComponent(product.slug)}` : allUrl);
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  let status = "";
  if (loading) status = "Searching";
  else if (error) status = "Search failed";
  else if (ready) status = results.length > 0 ? `${total} results found` : "No results found";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pt-4 md:pt-12">
      <form role="search" onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-line-strong">
        <Search aria-hidden="true" className="h-6 w-6 shrink-0 text-neutral-400" />
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          data-autofocus
          type="text"
          role="combobox"
          aria-expanded={optionCount > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Search products"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="min-h-14 w-full bg-transparent text-2xl font-light placeholder:text-neutral-400"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors hover:bg-neutral-100"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      {!canSearch && (
        <div className="space-y-3">
          <p className="text-sm text-neutral-500">Type at least {MIN_QUERY_LENGTH} characters to search.</p>
          <ul className="flex flex-wrap gap-2">
            {POPULAR_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm transition-colors hover:bg-neutral-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {canSearch && loading && (
        <div aria-hidden="true" className="space-y-2">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <div key={index} className="flex items-center gap-4 p-2">
              <Skeleton className="h-20 w-16 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {canSearch && !loading && error && <ErrorState message={error.message} onRetry={retry} className="py-8" />}

      {ready && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="No products found"
          description={`Nothing matched "${trimmed}". Try another word or browse the shop.`}
          action={
            <Button as={Link} to="/shop" variant="outline" onClick={onClose}>
              Browse all products
            </Button>
          }
          className="py-8"
        />
      )}

      {ready && results.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Search results" className="space-y-1">
          {results.map((product, index) => (
            <li
              key={product._id}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <Link
                to={`/product/${encodeURIComponent(product.slug)}`}
                onClick={onClose}
                tabIndex={-1}
                className={cx(
                  "flex items-center gap-4 rounded-lg p-2 transition-colors",
                  activeIndex === index && "bg-neutral-100"
                )}
              >
                <img
                  src={product.images?.[0]?.url ?? FALLBACK_IMAGE}
                  alt=""
                  width="64"
                  height="80"
                  loading="lazy"
                  className="h-20 w-16 shrink-0 rounded-lg bg-neutral-100 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{product.title}</span>
                  {product.brand && <span className="block truncate text-sm text-neutral-500">{product.brand}</span>}
                </span>
                <ResultPrice price={product.price} discountPrice={product.discountPrice} />
              </Link>
            </li>
          ))}
          <li
            id={`${listId}-option-${results.length}`}
            role="option"
            aria-selected={activeIndex === results.length}
            onMouseEnter={() => setActiveIndex(results.length)}
          >
            <Link
              to={allUrl}
              onClick={onClose}
              tabIndex={-1}
              className={cx(
                "flex min-h-12 items-center justify-center rounded-lg border border-line-strong px-4 text-sm font-medium transition-colors",
                activeIndex === results.length && "bg-neutral-100"
              )}
            >
              View all results ({total})
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

// Full-screen search opened by the Header search button (UIContext.searchOpen)
export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();

  return (
    <Modal open={searchOpen} onClose={closeSearch} title="Search" hideTitle size="full">
      <SearchPanel onClose={closeSearch} />
    </Modal>
  );
}