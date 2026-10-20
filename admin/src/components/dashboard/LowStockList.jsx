import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Thumb from "../common/Thumb";
import SectionCard from "./SectionCard";

// items: [{ id, title, image, stock }]
export default function LowStockList({ items = [], loading = false }) {
  return (
    <SectionCard
      title="Low stock"
      subtitle="Products running low"
      loading={loading}
      isEmpty={items.length === 0}
      emptyTitle="Stock looks healthy"
      emptyMessage="No products are running low right now."
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/products/${item.id}/edit`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
            >
              <Thumb src={item.image} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                {item.title}
              </span>
              <Badge tone={item.stock === 0 ? "danger" : "warning"}>
                {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}