import { COLOR_OPTIONS, SIZE_OPTIONS } from "../../data/shopFilters";
import { cx } from "../../utils/cx";
import { getCategoryKey, getCategoryLabel } from "../../utils/categories";
import ColorSwatch from "./ColorSwatch";
import FilterGroup from "./FilterGroup";
import FilterOption from "./FilterOption";
import PriceRangeFilter from "./PriceRangeFilter";

// onChange receives a patch object, e.g. onChange({ size: "M" }).
// brands: array of names. categories: array of category objects.
export default function FilterSidebar({ filters, onChange, brands = [], categories = [] }) {
  const toggle = (key, value) => onChange({ [key]: filters[key] === value ? "" : value });

  return (
    <div>
      {categories.length > 0 && (
        <FilterGroup title="Category">
          {categories.map((category) => {
            const key = getCategoryKey(category);
            return (
              <FilterOption
                key={key}
                label={getCategoryLabel(category)}
                className="capitalize"
                selected={filters.category === key}
                onClick={() => toggle("category", key)}
              />
            );
          })}
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Brand">
          {brands.map((brand) => (
            <FilterOption
              key={brand}
              label={brand}
              selected={filters.brand === brand}
              onClick={() => toggle("brand", brand)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Size">
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => {
            const selected = filters.size === size;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle("size", size)}
                className={cx(
                  "flex h-11 items-center justify-center rounded-md border text-sm transition-colors",
                  selected
                    ? "border-ink bg-ink text-white"
                    : "border-neutral-300 text-ink hover:border-ink"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-3">
          {COLOR_OPTIONS.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              size="md"
              selected={filters.color === color}
              onClick={() => toggle("color", color)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onChange}
        />
      </FilterGroup>

      <FilterGroup title="Offers">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(event) => onChange({ onSale: event.target.checked })}
            className="h-5 w-5 accent-primary"
          />
          Sale items only
        </label>
      </FilterGroup>
    </div>
  );
}