import { getDiscountPercent } from "../../utils/product";
import Badge from "../ui/Badge";

// props: { price, discountPrice, className } | renders nothing without a valid discount of at least 1%
export default function DiscountBadge({ price, discountPrice, className }) {
  const percent = getDiscountPercent(price, discountPrice);
  if (percent < 1) return null;

  return (
    <Badge tone="sale" className={className}>
      <span aria-hidden="true">-{percent}%</span>
      <span className="sr-only">{percent}% off</span>
    </Badge>
  );
}