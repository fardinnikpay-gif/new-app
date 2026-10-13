import { formatPrice } from "../../utils/format";
import { getItemImage } from "../../utils/cart";

// Items of a placed order (order.items[].price is the unit price at purchase time).
export default function OrderItems({ items }) {
  return (
    <ul aria-label="Order items" className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item, index) => (
        <li key={`${item.product}-${item.size}-${item.color}-${index}`} className="flex items-center gap-4 py-4">
          <img
            src={getItemImage(item)}
            alt=""
            width={64}
            height={80}
            loading="lazy"
            className="aspect-4/5 w-16 shrink-0 rounded-md bg-neutral-100 object-cover"
          />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-ink">{item.title}</p>
            <p className="mt-1 capitalize text-neutral-600">
              {item.color} · {item.size} × {item.qty}
            </p>
          </div>
          <p className="text-sm text-ink">{formatPrice(item.price * item.qty)}</p>
        </li>
      ))}
    </ul>
  );
}