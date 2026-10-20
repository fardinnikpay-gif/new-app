import { cx } from "../../utils/cx";
import TableSkeleton from "../ui/TableSkeleton";

// Card shell shared by every dashboard section: title, loading and empty states.
// min-w-0 lets charts shrink inside grid columns instead of widening the page.
export default function SectionCard({
  title,
  subtitle,
  action,
  loading = false,
  isEmpty = false,
  emptyTitle = "Nothing to show",
  emptyMessage,
  skeleton = <TableSkeleton rows={5} />,
  className,
  children,
}) {
  let body = children;

  if (loading) {
    body = skeleton;
  } else if (isEmpty) {
    body = (
      <div className="py-10 text-center">
        <p className="text-sm font-medium text-ink">{emptyTitle}</p>
        {emptyMessage && <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>}
      </div>
    );
  }

  return (
    <section
      aria-busy={loading || undefined}
      className={cx("min-w-0 rounded-lg bg-white p-5 shadow-card", className)}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      {body}
    </section>
  );
}