import { COUPON_TYPE_LABELS } from "../../utils/constants";
import { formatDiscount, isExpired } from "../../utils/coupon";
import { formatDate, formatNumber, formatPrice } from "../../utils/format";
import DataTable from "../common/DataTable";
import Badge from "../ui/Badge";
import CouponRowActions from "./CouponRowActions";

const formatUsage = (coupon) =>
  `${formatNumber(coupon.usedCount ?? 0)} / ${formatNumber(coupon.maxUses)}`;

const formatMinOrder = (coupon) =>
  Number(coupon.minOrder) > 0 ? formatPrice(coupon.minOrder) : "-";

function Code({ code }) {
  return <span className="font-mono font-semibold text-ink">{code}</span>;
}

function ActiveBadge({ active }) {
  return <Badge tone={active ? "success" : "neutral"}>{active ? "Active" : "Inactive"}</Badge>;
}

function Expiry({ iso }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {formatDate(iso)}
      {isExpired(iso) && <Badge tone="danger">Expired</Badge>}
    </span>
  );
}

// Table from md up, cards below.
export default function CouponsTable({ coupons, loading = false, onEdit, onSend, onDelete, emptyState }) {
  const renderActions = (coupon) => (
    <CouponRowActions coupon={coupon} onEdit={onEdit} onSend={onSend} onDelete={onDelete} />
  );

  const columns = [
    { key: "code", header: "Code", render: (c) => <Code code={c.code} /> },
    {
      key: "discount",
      header: "Discount",
      render: (c) => (
        <>
          <span className="block font-medium text-ink">{formatDiscount(c)}</span>
          <span className="block text-xs text-gray-500">{COUPON_TYPE_LABELS[c.type] ?? c.type}</span>
        </>
      ),
    },
    { key: "minOrder", header: "Min order", className: "hidden lg:table-cell", render: formatMinOrder },
    { key: "usage", header: "Used", render: formatUsage },
    { key: "expiresAt", header: "Expires", render: (c) => <Expiry iso={c.expiresAt} /> },
    { key: "status", header: "Status", render: (c) => <ActiveBadge active={c.isActive} /> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: renderActions,
    },
  ];

  const mobileCard = (coupon) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Code code={coupon.code} />
          <p className="text-sm text-gray-600">
            {formatDiscount(coupon)} · {COUPON_TYPE_LABELS[coupon.type] ?? coupon.type}
          </p>
        </div>
        <ActiveBadge active={coupon.isActive} />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-gray-500">Used</dt>
          <dd>{formatUsage(coupon)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Expires</dt>
          <dd>
            <Expiry iso={coupon.expiresAt} />
          </dd>
        </div>
      </dl>
      <div className="border-t border-gray-100 pt-3">{renderActions(coupon)}</div>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={coupons}
      loading={loading}
      mobileCard={mobileCard}
      emptyState={emptyState}
    />
  );
}