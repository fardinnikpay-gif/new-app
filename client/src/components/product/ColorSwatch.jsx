import { cx } from "../../utils/cx";
import { getColorHex } from "../../utils/colors";

const DOT_SIZES = { sm: "h-4 w-4", md: "h-7 w-7", lg: "h-9 w-9" };
const INITIAL_LENGTH = 2;

// props: { color (name), selected, size: sm|md|lg, onClick, disabled, className }
// Without onClick it is a plain visual (used on product cards). With onClick it is a 44px touch target.
export default function ColorSwatch({ color, selected = false, size = "md", onClick, disabled = false, className }) {
  const hex = getColorHex(color);

  const dot = (
    <span
      aria-hidden="true"
      style={hex ? { backgroundColor: hex } : undefined}
      className={cx(
        "grid place-items-center rounded-full border border-line-strong text-[0.625rem] uppercase text-neutral-600",
        DOT_SIZES[size],
        !hex && "bg-neutral-200",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {!hex && size !== "sm" ? String(color).slice(0, INITIAL_LENGTH) : null}
    </span>
  );

  if (!onClick) {
    return (
      <span role="img" aria-label={color} title={color} className={cx("inline-grid", className)}>
        {dot}
      </span>
    );
  }

  return (
    <button
      type="button"
      title={color}
      aria-label={color}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onClick(color)}
      className={cx(
        "grid h-11 w-11 place-items-center rounded-full transition-opacity",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {dot}
    </button>
  );
}