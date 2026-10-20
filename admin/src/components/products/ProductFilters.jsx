import { CATEGORIES, CATEGORY_LABELS } from "../../utils/constants";
import FilterTabs from "../common/FilterTabs";
import SearchInput from "../common/SearchInput";

const ALL_OPTION = { value: "", label: "All" };
const CATEGORY_OPTIONS = [
  ALL_OPTION,
  ...CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] })),
];
const STATUS_OPTIONS = [
  ALL_OPTION,
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function FilterGroup({ caption, children }) {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <span
        aria-hidden="true"
        className="text-xs font-medium uppercase tracking-wide text-gray-500"
      >
        {caption}
      </span>
      {children}
    </div>
  );
}

// params comes from usePagedQuery; empty filters are simply absent.
export default function ProductFilters({ params, onSearch, onFilter }) {
  return (
    <div className="mb-4 space-y-3">
      <SearchInput
        value={params.search ?? ""}
        onChange={onSearch}
        placeholder="Search by title or brand"
        label="Search products"
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <FilterGroup caption="Category">
          <FilterTabs
            label="Filter by category"
            options={CATEGORY_OPTIONS}
            value={params.category ?? ""}
            onChange={(value) => onFilter("category", value)}
          />
        </FilterGroup>
        <FilterGroup caption="Status">
          <FilterTabs
            label="Filter by status"
            options={STATUS_OPTIONS}
            value={params.status ?? ""}
            onChange={(value) => onFilter("status", value)}
          />
        </FilterGroup>
      </div>
    </div>
  );
}