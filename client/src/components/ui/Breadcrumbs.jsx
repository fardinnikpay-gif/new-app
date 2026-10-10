import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cx } from "../../utils/cx";

// props: { items: [{ label, to? }], className } , last item is the current page
export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link to={item.to} className="inline-flex min-h-11 items-center hover:text-ink md:min-h-0">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cx(isLast && "text-ink")}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight aria-hidden="true" className="h-4 w-4" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}