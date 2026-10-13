import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../../utils/cx";
import { getPageItems } from "../../utils/pagination";

const BASE = "flex h-11 min-w-11 items-center justify-center rounded-full text-sm transition-colors";
const ARROW = "hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent";

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={cx(BASE, ARROW)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      {getPageItems(page, pages).map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className={cx(BASE, "text-neutral-400")}>
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