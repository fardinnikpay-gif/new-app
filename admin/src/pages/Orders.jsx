import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { getAdminOrders } from "../api/orderApi";
import FilterTabs from "../components/common/FilterTabs";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import OrderDetailDrawer from "../components/orders/OrderDetailDrawer";
import OrdersTable from "../components/orders/OrdersTable";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";
import useOrderMutations from "../hooks/useOrderMutations";
import usePagedQuery from "../hooks/usePagedQuery";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../utils/constants";
import { mergeOrder } from "../utils/order";

const INITIAL_QUERY = { search: "", status: "" };
const FIRST_PAGE = 1;
const STATUS_OPTIONS = [
  { value: "", label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

const patchOrder = (updated) => (data) =>
  data
    ? {
        ...data,
        orders: data.orders.map((order) =>
          order._id === updated._id ? mergeOrder(order, updated) : order
        ),
      }
    : data;

export default function Orders() {
  const { params, setPage, setSearch, setFilter, reset } = usePagedQuery(INITIAL_QUERY);
  const { data, loading, error, reload, setData } = useAsync(
    (signal) => getAdminOrders(params, signal),
    [params]
  );
  // `order` (the clicked row) is kept after closing so the drawer title does not flip while it exits.
  const [drawer, setDrawer] = useState({ open: false, order: null });

  // The list is never refetched after a change: the row is patched in place (Refresh is manual).
  const handleUpdated = useCallback((updated) => setData(patchOrder(updated)), [setData]);
  const { pendingIds, changeStatus } = useOrderMutations(handleUpdated);

  const openOrder = useCallback((order) => setDrawer({ open: true, order }), []);
  const closeDrawer = useCallback(() => setDrawer((prev) => ({ ...prev, open: false })), []);

  const page = params.page;
  const orders = data?.orders ?? [];
  const hasFilters = Boolean(params.search || params.status);

  // The URL can point past the last page (e.g. ?page=99): jump to the real last page.
  useEffect(() => {
    if (loading || !data) return;
    if (data.orders.length === 0 && data.total > 0 && page > FIRST_PAGE) {
      setPage(Math.max(data.pages, FIRST_PAGE));
    }
  }, [loading, data, page, setPage]);

  const emptyState = hasFilters ? (
    <EmptyState
      icon={ShoppingBag}
      title="No orders match your filters"
      message="Try a different search or clear the filters."
      action={
        <Button variant="outline" onClick={reset}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={ShoppingBag}
      title="No orders yet"
      message="Orders will appear here once customers place them."
    />
  );

  return (
    <>
      <PageHeader
        title="Orders"
        actions={
          <Button variant="outline" onClick={reload} loading={loading}>
            {!loading && <RefreshCw className="size-4" aria-hidden="true" />}
            Refresh
          </Button>
        }
      />

      <div className="mb-4 space-y-3 lg:flex lg:items-center lg:justify-between lg:space-y-0">
        <FilterTabs
          label="Filter by status"
          options={STATUS_OPTIONS}
          value={params.status ?? ""}
          onChange={(value) => setFilter("status", value)}
        />
        <SearchInput
          value={params.search ?? ""}
          onChange={setSearch}
          placeholder="Search by order number or customer"
          label="Search orders"
        />
      </div>

      {error ? (
        <ErrorState title="Could not load orders" message={error.message} onRetry={reload} />
      ) : (
        <>
          <OrdersTable
            orders={orders}
            loading={loading}
            pendingIds={pendingIds}
            onOpen={openOrder}
            onChangeStatus={changeStatus}
            emptyState={emptyState}
          />
          {data && <Pagination page={page} pages={data.pages} total={data.total} onChange={setPage} />}
        </>
      )}

      <OrderDetailDrawer
        orderId={drawer.order?._id ?? null}
        preview={drawer.order}
        open={drawer.open}
        onClose={closeDrawer}
        onOrderUpdated={handleUpdated}
      />
    </>
  );
}