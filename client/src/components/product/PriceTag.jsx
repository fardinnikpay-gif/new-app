import { cx } from "../../utils/cx";
import { formatPrice } from "../../utils/format";
import { isOnSale } from "../../utils/product";

const SIZES = { sm: "text-sm", md: "text-base", lg: "text-2xl" };

// props: { price, discountPrice, size: sm|md|lg, className }
// On sale: the new price first, the old price struck through (screen readers hear both labels).
export default function PriceTag({ price, discountPrice, size = "md", className }) {
  if (!isOnSale(price, discountPrice)) {
    return <span className={cx(SIZES[size], className)}>{formatPrice(price)}</span>;
  }

  return (
    <span className={cx("inline-flex flex-wrap items-baseline gap-x-2", SIZES[size], className)}>
      <span className="sr-only">Sale price</span>
      <span className="font-medium">{formatPrice(discountPrice)}</span>
      <span className="sr-only">Original price</span>
      <s className="text-[0.85em] text-neutral-400">{formatPrice(price)}</s>
    </span>
  );
}