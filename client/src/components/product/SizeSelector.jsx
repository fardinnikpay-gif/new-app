import { cx } from "../../utils/cx";
import { getSizes, isSizeAvailable } from "../../utils/product";

// props: { variants, selectedSize, onSelect(size), selectedColor, className }
// Sizes without stock are disabled and struck through. With a selected color only that color's stock counts.
export default function SizeSelector({ variants = [], selectedSize, onSelect, selectedColor = null, className }) {
  return (
    <div role="group" aria-label="Size" className={cx("flex flex-wrap gap-2", className)}>
      {getSizes(variants).map((size) => {
        const available = isSizeAvailable(variants, size, selectedColor);
        const selected = available && selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            disabled={!available}
            aria-pressed={selected}
            aria-label={available ? `Size ${size}` : `Size ${size}, out of stock`}
            onClick={() => onSelect(size)}
            className={cx(
              "min-h-11 min-w-11 rounded-lg border px-3 text-sm transition-colors",
              selected ? "border-ink bg-ink text-surface" : "border-line-strong",
              available && !selected && "hover:border-ink",
              !available && "cursor-not-allowed text-neutral-400 line-through opacity-50"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}