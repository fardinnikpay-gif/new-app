import { formatDate, formatPrice } from "../../utils/format";
import {
  getCustomer,
  getCustomerName,
  getItemCount,
  getPaymentLabel,
  getShortOrderId,
} from "../../utils/order";
import DataTable from "../common/DataTable";
import OrderStatusSelect from "./OrderStatusSelect";
import PaymentBadge from "./PaymentBadge";

function CustomerCell({ order }) {
  const name = getCustomerName(order);
  const customer = getCustomer(order);
  if (!name) return <span className="text-gray-500">-</span>;

  return (
    <>
      <span className="block max-w-48 truncate font-medium text-ink" title={name}>
        {name}
      </span>
      {customer?.name && customer.email && (
        <span className="block max-w-48 truncate text-xs text-gray-500">{customer.email}</span>
      )}
    </>
  );
}

// onOpen(order) opens the detail drawer. Columns drop out as the screen narrows
// (items and payment method below xl, date below lg) and the table becomes cards below md.
export default function OrdersTable({
  orders,
  loading = false,
  pendingIds = [],
  onOpen,
  onChangeStatus,
  emptyState,
}) {
  const renderStatus = (order) => (
    <OrderStatusSelect
      order={order}
      pending={pendingIds.includes(order._id)}
      onChange={onChangeStatus}
    />
  );

  const columns = [
    { key: "number", header: "Order", render: (o) => `#${getShortOrderId(o._id)}` },
    { key: "customer", header: "Customer", render: (o) => <CustomerCell order={o} /> },
    {
      key: "date",
      header: "Date",
      className: "hidden lg:table-cell",
      render: (o) => formatDate(o.createdAt),
    },
    { key: "items", header: "Items", className: "hidden xl:table-cell", render: getItemCount },
    { key: "total", header: "Total", className: "text-right", render: (o) => formatPrice(o.totalPrice) },
    {
      key: "method",
      header: "Payment",
      className: "hidden xl:table-cell",
      render: (o) => getPaymentLabel(o.paymentMethod),
    },
    {
      key: "paid",
      header: "Paid",
      render: (o) => (
        <>
          <PaymentBadge order={o} />
          <span className="mt-1 block text-xs text-gray-500 xl:hidden">
            {getPaymentLabel(o.paymentMethod)}
          </span>
        </>
      ),
    },
    { key: "status", header: "Status", render: renderStatus },
  ];

  const mobileCard = (order, open) => {
    const count = getItemCount(order);
    return (
      <div className="space-y-3">
        {/* A real button, so the card is reachable and usable with the keyboard. */}
        <button
          type="button"
          onClick={open}
          className="flex w-full items-start justify-between gap-3 rounded-lg text-left"
        >
          <span className="min-w-0">
            <span className="block font-semibold text-ink">#{getShortOrderId(order._id)}</span>
            <span className="block truncate text-sm text-gray-600">
              {getCustomerName(order) || "-"}
            </span>
            <span className="block text-xs text-gray-500">
              {formatDate(order.createdAt)} · {count} {count === 1 ? "item" : "items"}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className="font-medium text-ink">{formatPrice(order.totalPrice)}</span>
            <PaymentBadge order={order} />
          </span>
        </button>
        <div className="border-t border-gray-100 pt-3">{renderStatus(order)}</div>
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      rows={orders}
      loading={loading}
      onRowClick={onOpen}
      mobileCard={mobileCard}
      emptyState={emptyState}
    />
  );
}