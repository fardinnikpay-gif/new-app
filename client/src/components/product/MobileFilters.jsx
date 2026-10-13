import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import FilterSidebar from "./FilterSidebar";

// Phone/tablet: "Filters (N)" button that opens the sidebar inside a Drawer.
export default function MobileFilters({
  filters,
  onChange,
  onClear,
  brands,
  categories,
  activeCount,
  total,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </Button>

      <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Filters">
        <FilterSidebar
          filters={filters}
          onChange={onChange}
          brands={brands}
          categories={categories}
        />
        <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-neutral-200 bg-white py-4">
          <Button variant="outline" onClick={onClear} disabled={activeCount === 0}>
            Clear all
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Show {total} {total === 1 ? "result" : "results"}
          </Button>
        </div>
      </Drawer>
    </>
  );
}