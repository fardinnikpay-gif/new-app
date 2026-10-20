import { useReducedMotion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPrice } from "../../utils/format";
import ChartSkeleton from "./ChartSkeleton";
import SectionCard from "./SectionCard";

const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });
const AREA_OPACITY = 0.12;
const STROKE_WIDTH = 2;
const AXIS_TICK = { fill: "var(--color-chart-axis)" };

const formatAxisValue = (value) => compactFormatter.format(value);
const formatTooltip = (value) => [formatPrice(value), "Sales"];

// data: [{ month, total }]. Text size comes from `text-xs` on the wrapper (SVG text inherits it).
export default function SalesChart({ data = [], loading = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionCard
      title="Sales by month"
      loading={loading}
      skeleton={<ChartSkeleton className="h-72" />}
      isEmpty={data.length === 0}
      emptyTitle="No sales yet"
      emptyMessage="Monthly sales will appear here once orders come in."
    >
      <div role="img" aria-label="Area chart of sales by month" className="h-72 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_TICK} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              tickFormatter={formatAxisValue}
            />
            <Tooltip formatter={formatTooltip} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-primary)"
              strokeWidth={STROKE_WIDTH}
              fill="var(--color-primary)"
              fillOpacity={AREA_OPACITY}
              isAnimationActive={!reduceMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* The same data as text, for screen readers. */}
      <table className="sr-only">
        <caption>Sales by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={`${row.month}-${index}`}>
              <td>{row.month}</td>
              <td>{formatPrice(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}