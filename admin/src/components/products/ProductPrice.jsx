import { formatPrice } from "../../utils/format";

// A discount only counts when it is a positive amount below the normal price.
const hasDiscount = (price, discountPrice) => {
  const discount = Number(discountPrice);
  return discount > 0 && discount < Number(price);
};

export default function ProductPrice({ price, discountPrice }) {
  if (!hasDiscount(price, discountPrice)) {
    return <span className="font-medium text-ink">{formatPrice(price)}</span>;
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className="sr-only">Sale price: </span>
      <span className="font-medium text-ink">{formatPrice(discountPrice)}</span>
      <span className="sr-only">Original price: </span>
      <s className="text-xs text-gray-500">{formatPrice(price)}</s>
    </span>
  );
}