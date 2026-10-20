import { Link } from "react-router-dom";
import { DASHBOARD_LIST_LIMIT } from "../../utils/constants";
import { formatDate, formatPrice } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";
import SectionCard from "./SectionCard";

// orders: [{ id, number, customer, total, status, createdAt }]
export default function RecentOrders({ orders = [], loading = false }) {
  const recent = orders.slice(0, DASHBOARD_LIST_LIMIT);

  return (
    <SectionCard
      title="Recent orders"
      loading={loading}
      isEmpty={recent.length === 0}
      emptyTitle="No orders yet"
      emptyMessage="New orders will show up here."
      action={
        <Link to="/orders" className="text-sm font-medium text-primary-dark hover:underline">
          View all
        </Link>
      }
    >
      <ul className="divide-y divide-gray-100">
        {recent.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders?search=${encodeURIComponent(order.number)}`}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">#{order.number}</p>
                <p className="truncate text-sm text-gray-500">
                  {order.customer || "-"} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {order.status && <StatusBadge status={order.status} />}
                <span className="text-sm font-medium text-ink">{formatPrice(order.total)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}