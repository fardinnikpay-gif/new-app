import { PAGE_SIZE } from "../../utils/constants";
import { cx } from "../../utils/cx";
import EmptyState from "../ui/EmptyState";
import TableSkeleton from "../ui/TableSkeleton";

// Clicks on these inside a row must not trigger the row's own click.
const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, label, [role='switch']";

const renderCell = (column, row) => (column.render ? column.render(row) : row[column.key]);

// columns: [{ key, header, render?, className? }]  (className applies to th and td)
// mobileCard(row, open): optional card layout below md; `open` is undefined without onRowClick.
// Without mobileCard the table scrolls horizontally inside its own container.
export default function DataTable({
  columns,
  rows = [],
  loading = false,
  onRowClick,
  emptyState,
  mobileCard,
  rowKey = "_id",
}) {
  const hasRows = rows.length > 0;

  if (loading && !hasRows) return <TableSkeleton rows={PAGE_SIZE} />;
  if (!hasRows) return emptyState ?? <EmptyState title="No results found" />;

  const handleRowClick = (event, row) => {
    if (event.target.closest(INTERACTIVE_SELECTOR)) return;
    onRowClick(row);
  };

  // While refetching, keep the old rows visible but dimmed.
  const busyProps = { "aria-busy": loading || undefined };

  return (
    <>
      {mobileCard && (
        <ul className={cx("space-y-3 md:hidden", loading && "opacity-60")} {...busyProps}>
          {rows.map((row) => (
            <li
              key={row[rowKey]}
              onClick={onRowClick ? (event) => handleRowClick(event, row) : undefined}
              className={cx(
                "rounded-lg bg-white p-4 shadow-card",
                onRowClick && "cursor-pointer active:bg-gray-50"
              )}
            >
              {mobileCard(row, onRowClick ? () => onRowClick(row) : undefined)}
            </li>
          ))}
        </ul>
      )}

      <div
        className={cx(
          "overflow-x-auto rounded-lg bg-white shadow-card",
          mobileCard && "hidden md:block",
          loading && "opacity-60"
        )}
        {...busyProps}
      >
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cx("whitespace-nowrap px-4 py-3", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? (event) => handleRowClick(event, row) : undefined}
                className={cx(onRowClick && "cursor-pointer hover:bg-gray-50")}
              >
                {columns.map((column, index) => (
                  <td key={column.key} className={cx("px-4 py-3", column.className)}>
                    {onRowClick && index === 0 ? (
                      // Real button = keyboard access for clickable rows.
                      <button
                        type="button"
                        onClick={() => onRowClick(row)}
                        className="rounded font-medium text-primary-dark hover:underline"
                      >
                        {renderCell(column, row)}
                      </button>
                    ) : (
                      renderCell(column, row)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}