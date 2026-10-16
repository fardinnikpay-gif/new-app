import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../../utils/cx";
import { getPageItems } from "../../utils/pagination";

const BASE = "flex h-11 min-w-11 items-center justify-center rounded-full text-sm transition-colors";
const ARROW = "hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent";

// Phones: prev / "Page X of Y" / next. From sm: full numbered list.
export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={cx(BASE, ARROW)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <p aria-live="polite" className="px-3 text-sm text-neutral-600 sm:hidden">
        Page {page} of {pages}
      </p>

      <div className="hidden items-center gap-1 sm:flex">
        {getPageItems(page, pages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className={cx(BASE, "text-neutral-500")}>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onChange(item)}
              className={cx(BASE, item === page ? "bg-ink text-white" : "text-ink hover:bg-neutral-100")}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={cx(BASE, ARROW)}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  );
}