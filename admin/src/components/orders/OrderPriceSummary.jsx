import { formatPrice } from "../../utils/format";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-gray-600">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

export default function OrderPriceSummary({ order }) {
  const hasDiscount = Number(order.discountAmount) > 0;
  const hasShipping = Number(order.shippingPrice) > 0;

  return (
    <dl className="space-y-2 text-sm">
      <Row label="Items" value={formatPrice(order.itemsPrice)} />
      {hasDiscount && (
        <Row
          label={order.couponCode ? `Discount (${order.couponCode})` : "Discount"}
          value={`-${formatPrice(order.discountAmount)}`}
        />
      )}
      <Row label="Shipping" value={hasShipping ? formatPrice(order.shippingPrice) : "Free"} />
      <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 text-base font-semibold text-ink">
        <dt>Total</dt>
        <dd>{formatPrice(order.totalPrice)}</dd>
      </div>
    </dl>
  );
}