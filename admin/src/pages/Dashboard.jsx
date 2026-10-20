import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CircleDollarSign, Clock, Package, RefreshCw, ShoppingBag, Users } from "lucide-react";
import { getStats } from "../api/statsApi";
import PageHeader from "../components/common/PageHeader";
import SectionBoundary from "../components/common/SectionBoundary";
import LowStockList from "../components/dashboard/LowStockList";
import OrdersByStatusChart from "../components/dashboard/OrdersByStatusChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import SalesChart from "../components/dashboard/SalesChart";
import StatCard from "../components/dashboard/StatCard";
import TopProducts from "../components/dashboard/TopProducts";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";
import { formatNumber, formatPrice } from "../utils/format";
import { normalizeStats } from "../utils/stats";

const buildCards = (stats) => [
  { title: "Total sales", value: formatPrice(stats.totalSales), icon: CircleDollarSign },
  {
    title: "Orders",
    value: formatNumber(stats.ordersCount),
    icon: ShoppingBag,
    hint: stats.pendingOrders > 0 ? `${formatNumber(stats.pendingOrders)} pending` : undefined,
  },
  { title: "Users", value: formatNumber(stats.usersCount), icon: Users },
  { title: "Products", value: formatNumber(stats.productsCount), icon: Package },
];

export default function Dashboard() {
  const { data, loading, error, reload } = useAsync(getStats, []);
  const stats = useMemo(() => normalizeStats(data), [data]);
  const initialLoading = loading && !data;

  // Every section reads the same endpoint, so a failed request gets one error state.
  if (error && !data) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorState title="Could not load the dashboard" message={error.message} onRetry={reload} />
      </>
    );
  }

  const boundaryProps = { onRetry: reload, resetKey: data };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Store overview"
        actions={
          <Button variant="outline" onClick={reload} loading={loading}>
            {!loading && <RefreshCw className="size-4" aria-hidden="true" />}
            Refresh
          </Button>
        }
      />

      {/* A refresh failed but older data is still on screen. */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger-fg"
        >
          <span>Could not refresh: {error.message}. Showing the last loaded data.</span>
          <Button variant="outline" size="sm" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {stats.pendingOrders > 0 && (
        <Link
          to="/orders?status=pending"
          className="mb-6 flex items-center gap-3 rounded-lg bg-warning-bg px-4 py-3 text-sm font-medium text-warning-fg hover:opacity-90"
        >
          <Clock className="size-5 shrink-0" aria-hidden="true" />
          <span className="flex-1">
            {formatNumber(stats.pendingOrders)}{" "}
            {stats.pendingOrders === 1 ? "order is" : "orders are"} waiting to be processed
          </span>
          <span className="underline">Review</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildCards(stats).map((card) => (
          <StatCard key={card.title} loading={initialLoading} {...card} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <SectionBoundary label="Sales chart" {...boundaryProps}>
            <SalesChart data={stats.salesByMonth} loading={initialLoading} />
          </SectionBoundary>
        </div>
        <SectionBoundary label="Orders chart" {...boundaryProps}>
          <OrdersByStatusChart data={stats.ordersByStatus} loading={initialLoading} />
        </SectionBoundary>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionBoundary label="Top products" {...boundaryProps}>
          <TopProducts items={stats.topProducts} loading={initialLoading} />
        </SectionBoundary>
        <SectionBoundary label="Low stock" {...boundaryProps}>
          <LowStockList items={stats.lowStockProducts} loading={initialLoading} />
        </SectionBoundary>
      </div>

      <div className="mt-6">
        <SectionBoundary label="Recent orders" {...boundaryProps}>
          <RecentOrders orders={stats.recentOrders} loading={initialLoading} />
        </SectionBoundary>
      </div>
    </>
  );
}