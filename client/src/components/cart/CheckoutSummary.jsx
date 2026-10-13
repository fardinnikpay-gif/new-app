import { findLine, getItemImage, getLineAmounts } from "../../utils/cart";
import { formatPrice } from "../../utils/format";
import FormError from "../account/FormError";
import CouponInput from "./CouponInput";
import OrderSummary from "./OrderSummary";

// Items list + the same OrderSummary used in the cart (fresh prices from preview).
// coupon: { applied, error, onApply, onRemove }. When `locked` (card payment in progress)
// the coupon and the place-order button are hidden.
export default function CheckoutSummary({
  items, pricing, loading, placing, canPlace, onPlace, coupon, hint, error, locked,
}) {
  return (
    <div className="space-y-4">
      <ul aria-label="Items in your order" className="space-y-4 rounded-lg border border-neutral-200 p-6">
        {items.map((item, index) => {
          const { total } = getLineAmounts(findLine(pricing, item, index, items.length), item);
          return (
            <li key={item.key} className="flex items-center gap-4">
              <img
                src={getItemImage(item)}
                alt=""
                width={56}
                height={70}
                loading="lazy"
                className="aspect-4/5 w-14 shrink-0 rounded-md bg-neutral-100 object-cover"
              />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="capitalize text-neutral-600">
                  {item.color} · {item.size} × {item.qty}
                </p>
              </div>
              <p className="text-sm text-ink">{formatPrice(total)}</p>
            </li>
          );
        })}
      </ul>

      <OrderSummary
        pricing={pricing}
        loading={loading}
        ctaLabel={placing ? "Placing order…" : "Place order"}
        ctaLoading={placing}
        onCta={locked ? undefined : onPlace}
        disabled={!canPlace}
      >
        {locked ? null : (
          <>
            <CouponInput {...coupon} />
            {hint && <p className="mt-4 text-sm text-neutral-600">{hint}</p>}
            <div className="mt-4 empty:hidden">
              <FormError message={error} />
            </div>
          </>
        )}
      </OrderSummary>
    </div>
  );
}