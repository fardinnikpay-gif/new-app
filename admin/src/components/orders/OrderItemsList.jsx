import { getColorHex } from "../../utils/colors";
import { formatPrice } from "../../utils/format";
import Thumb from "../common/Thumb";

// items: [{ product, title, image, size, color, qty, price }]  (price = unit price)
export default function OrderItemsList({ items = [] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item, index) => (
        <li
          key={`${item.product ?? "item"}-${item.size}-${item.color}-${index}`}
          className="flex gap-3 py-3 first:pt-0 last:pb-0"
        >
          <Thumb src={item.image} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              <span>Size: {item.size || "-"}</span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="block size-3.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorHex(item.color) ?? "transparent" }}
                />
                {item.color || "-"}
              </span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {item.qty} × {formatPrice(item.price)}
            </p>
          </div>
          <p className="shrink-0 font-medium text-ink">
            {formatPrice(Number(item.qty) * Number(item.price))}
          </p>
        </li>
      ))}
    </ul>
  );
}