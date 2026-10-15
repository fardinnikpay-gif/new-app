import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatDate, formatPrice } from "../../utils/format";
import { getItemImage } from "../../utils/cart";
import { formatOrderNumber, getOrderItemCount } from "../../utils/order";
import OrderStatusBadge from "./OrderStatusBadge";
import { staggerDelay } from "../../utils/motion";
import Reveal from "../motion/Reveal";

const MAX_THUMBS = 3;

export default function OrderListItem({ order, index = 0 }) {
  const thumbs = order.items.slice(0, MAX_THUMBS);
  const extra = order.items.length - thumbs.length;
  const count = getOrderItemCount(order);

  return (
    <Reveal as="li" delay={staggerDelay(index)}>
      <Link
        to={`/account/orders/${order._id}`}
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-ink sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-ink">
              {formatOrderNumber(order)}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-1 text-sm text-neutral-600">
            {formatDate(order.createdAt)} · {count}{" "}
            {count === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2" aria-hidden="true">
            {thumbs.map((item, index) => (
              <img
                key={index}
                src={getItemImage(item)}
                alt=""
                width={40}
                height={48}
                loading="lazy"
                className="h-12 w-10 rounded border-2 border-white bg-neutral-100 object-cover"
              />
            ))}

            {extra > 0 && (
              <span className="flex h-12 w-10 items-center justify-center rounded border-2 border-white bg-neutral-100 text-xs text-neutral-600">
                +{extra}
              </span>
            )}
          </div>

          <p className="font-medium text-ink">
            {formatPrice(order.totalPrice)}
          </p>

          <ChevronRight
            className="hidden h-5 w-5 text-neutral-400 sm:block"
            aria-hidden="true"
          />
        </div>
      </Link>
    </Reveal>
  );
}
