import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export default function Pagination({ page, pages, total, onChange }) {
  if (!total) return null;

  const lastPage = Math.max(pages, 1);
  const current = Math.min(Math.max(page, 1), lastPage);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-gray-500">
        {total} {total === 1 ? "result" : "results"}
      </p>
      {lastPage > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(current - 1)}
            disabled={current <= 1}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
          <span className="px-2 text-sm text-gray-600" aria-live="polite">
            Page {current} of {lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(current + 1)}
            disabled={current >= lastPage}
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </nav>
  );
}