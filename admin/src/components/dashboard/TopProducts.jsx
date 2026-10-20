import { DASHBOARD_LIST_LIMIT } from "../../utils/constants";
import { formatNumber } from "../../utils/format";
import Thumb from "../common/Thumb";
import SectionCard from "./SectionCard";

// items: [{ id, title, image, sold }]
export default function TopProducts({ items = [], loading = false }) {
  const top = items.slice(0, DASHBOARD_LIST_LIMIT);

  return (
    <SectionCard
      title="Top products"
      subtitle="Best sellers"
      loading={loading}
      isEmpty={top.length === 0}
      emptyTitle="No sales data yet"
      emptyMessage="Best-selling products will show up here."
    >
      <ol className="space-y-3">
        {top.map((item, index) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className="w-5 text-sm font-semibold text-gray-500">{index + 1}</span>
            <Thumb src={item.image} />
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{item.title}</p>
            <span className="shrink-0 text-sm text-gray-600">{formatNumber(item.sold)} sold</span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}