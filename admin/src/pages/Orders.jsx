import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "../components/common/DataTable";
import FilterTabs from "../components/common/FilterTabs";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import Thumb from "../components/common/Thumb";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import usePagedQuery from "../hooks/usePagedQuery";
import { ORDER_STATUSES, PAGE_SIZE } from "../utils/constants";
import { formatDate, formatPrice } from "../utils/format";

// TEMPORARY playground for the step-3 components. Fake data, client-side filtering.
const DEMO_ROWS = 27;
const DEMO_LOADING_MS = 800;
const ALL_ROWS = Array.from({ length: DEMO_ROWS }, (_, i) => ({
  _id: `order${String(i + 1).padStart(6, "0")}abcdef`,
  customer: `Customer ${i + 1}`,
  status: ORDER_STATUSES[i % ORDER_STATUSES.length],
  total: 20 + i * 7.5,
  createdAt: new Date(2026, 9, 1 + (i % 28)).toISOString(),
  image: i % 2 ? "https://invalid.invalid/broken.jpg" : null,
}));

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: status[0].toUpperCase() + status.slice(1) })),
];

const shortId = (row) => row._id.slice(-8);

const columns = [
  { key: "id", header: "Order", render: (row) => `#${shortId(row)}` },
  {
    key: "customer",
    header: "Customer",
    render: (row) => (
      <span className="flex items-center gap-2">
        <Thumb src={row.image} size="sm" />
        {row.customer}
      </span>
    ),
  },
  { key: "date", header: "Date", className: "hidden lg:table-cell", render: (row) => formatDate(row.createdAt) },
  { key: "total", header: "Total", className: "text-right", render: (row) => formatPrice(row.total) },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
];

const mobileCard = (row) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <p className="font-medium">#{shortId(row)}</p>
      <p className="truncate text-sm text-gray-500">
        {row.customer} · {formatDate(row.createdAt)}
      </p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <StatusBadge status={row.status} />
      <span className="text-sm font-medium">{formatPrice(row.total)}</span>
    </div>
  </div>
);

export default function Orders() {
  const { params, setPage, setSearch, setFilter } = usePagedQuery({ search: "", status: "" });
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = (params.search ?? "").toLowerCase();
    return ALL_ROWS.filter(
      (row) =>
        (!params.status || row.status === params.status) &&
        (!term || row.customer.toLowerCase().includes(term))
    );
  }, [params.status, params.search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(params.page, pages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), DEMO_LOADING_MS);
  };

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Temporary playground for the step-3 components"
        actions={
          <Button variant="outline" onClick={simulateLoading}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Simulate loading
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
          placeholder="Search by customer"
        />
      </div>
      <DataTable
        columns={columns}
        rows={loading ? [] : rows}
        loading={loading}
        onRowClick={(row) => toast(`Opened #${shortId(row)}`)}
        mobileCard={mobileCard}
        emptyState={<EmptyState title="No orders found" message="Try changing the filters." />}
      />
      <Pagination page={page} pages={pages} total={filtered.length} onChange={setPage} />
    </>
  );
}