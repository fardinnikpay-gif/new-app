import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getColorHex } from "../../utils/colors";
import { formatPrice } from "../../utils/format";

const CHIP_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 },
};

const priceLabel = (min, max) => {
  if (min && max) return `${formatPrice(Number(min))} – ${formatPrice(Number(max))}`;
  if (min) return `From ${formatPrice(Number(min))}`;
  return `Up to ${formatPrice(Number(max))}`;
};

// Each chip carries the patch that removes it.
const buildChips = (filters) => {
  const chips = [];
  if (filters.search) chips.push({ id: "search", label: `“${filters.search}”`, patch: { search: "" } });
  if (filters.category) chips.push({ id: "category", label: filters.category, patch: { category: "" } });
  if (filters.brand) chips.push({ id: "brand", label: filters.brand, patch: { brand: "" } });
  if (filters.size) chips.push({ id: "size", label: `Size ${filters.size}`, patch: { size: "" } });
  if (filters.color) {
    chips.push({
      id: "color",
      label: filters.color,
      hex: getColorHex(filters.color),
      patch: { color: "" },
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    chips.push({
      id: "price",
      label: priceLabel(filters.minPrice, filters.maxPrice),
      patch: { minPrice: "", maxPrice: "" },
    });
  }
  if (filters.onSale) chips.push({ id: "onSale", label: "On sale", patch: { onSale: false } });
  return chips;
};

// onRemove receives the chip's patch (same shape as FilterSidebar's onChange).
export default function ActiveFilterChips({ filters, onRemove, onClearAll }) {
  const chips = buildChips(filters);
  if (!chips.length) return null;

  return (
    <ul aria-label="Active filters" className="flex flex-wrap items-center py-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.li key={chip.id} className="mr-2" {...CHIP_MOTION}>
            <button
              type="button"
              onClick={() => onRemove(chip.patch)}
              aria-label={`Remove filter: ${chip.label}`}
              className="flex min-h-11 items-center"
            >
              <span className="flex h-8 items-center gap-2 rounded-full bg-neutral-100 px-3 text-sm capitalize text-ink transition-colors hover:bg-neutral-200">
                {chip.hex && (
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full border border-neutral-300"
                    style={{ backgroundColor: chip.hex }}
                  />
                )}
                {chip.label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </motion.li>
        ))}
      </AnimatePresence>

      {onClearAll && (
        <li>
          <button
            type="button"
            onClick={onClearAll}
            className="min-h-11 px-2 text-sm text-neutral-600 underline-offset-4 hover:text-ink hover:underline"
          >
            Clear all
          </button>
        </li>
      )}
    </ul>
  );
}