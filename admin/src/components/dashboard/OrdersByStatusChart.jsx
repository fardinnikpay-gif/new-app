import { useReducedMotion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ORDER_STATUS_LABELS } from "../../utils/constants";
import { cx } from "../../utils/cx";
import { formatNumber } from "../../utils/format";
import ChartSkeleton from "./ChartSkeleton";
import SectionCard from "./SectionCard";

// Full class names (not built dynamically) so Tailwind can see them.
const STATUS_STYLE = {
  pending: { fill: "var(--color-chart-pending)", dot: "bg-chart-pending" },
  processing: { fill: "var(--color-chart-processing)", dot: "bg-chart-processing" },
  shipped: { fill: "var(--color-chart-shipped)", dot: "bg-chart-shipped" },
  delivered: { fill: "var(--color-chart-delivered)", dot: "bg-chart-delivered" },
  cancelled: { fill: "var(--color-chart-cancelled)", dot: "bg-chart-cancelled" },
};
const INNER_RADIUS = "62%";
const OUTER_RADIUS = "90%";
const SLICE_GAP = 2;

const formatTooltip = (value, name) => [value, ORDER_STATUS_LABELS[name] ?? name];

// data: [{ status, count }] with all five statuses.
export default function OrdersByStatusChart({ data = [], loading = false }) {
  const reduceMotion = useReducedMotion();
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <SectionCard
      title="Orders by status"
      loading={loading}
      skeleton={<ChartSkeleton className="h-56" />}
      isEmpty={total === 0}
      emptyTitle="No orders yet"
      emptyMessage="The status breakdown will appear here."
    >
      <div className="relative h-56 w-full">
        <div
          role="img"
          aria-label={`Donut chart of ${total} orders by status`}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                innerRadius={INNER_RADIUS}
                outerRadius={OUTER_RADIUS}
                paddingAngle={SLICE_GAP}
                stroke="none"
                isAnimationActive={!reduceMotion}
              >
                {data.map((item) => (
                  <Cell key={item.status} fill={STATUS_STYLE[item.status].fill} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-ink">{formatNumber(total)}</span>
          <span className="text-xs text-gray-500">orders</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {data.map((item) => (
          <li key={item.status} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-700">
              <span
                aria-hidden="true"
                className={cx("size-3 rounded-full", STATUS_STYLE[item.status].dot)}
              />
              {ORDER_STATUS_LABELS[item.status]}
            </span>
            <span className="font-medium text-ink">{formatNumber(item.count)}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}