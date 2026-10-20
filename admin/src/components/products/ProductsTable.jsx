import { CATEGORY_LABELS } from "../../utils/constants";
import DataTable from "../common/DataTable";
import Thumb from "../common/Thumb";
import ProductActiveSwitch from "./ProductActiveSwitch";
import ProductPrice from "./ProductPrice";
import ProductRowActions from "./ProductRowActions";
import StockBadge from "./StockBadge";

const getImage = (product) => product.images?.[0]?.url ?? null;
const getCategoryLabel = (category) => CATEGORY_LABELS[category] ?? category;

// Table from md up, cards below. Columns drop out as the screen narrows:
// brand moves under the title below xl, category is hidden below lg.
export default function ProductsTable({
  products,
  loading = false,
  pendingIds = [],
  onToggle,
  onDelete,
  emptyState,
}) {
  const renderSwitch = (product) => (
    <ProductActiveSwitch
      product={product}
      pending={pendingIds.includes(product._id)}
      onToggle={onToggle}
    />
  );

  const columns = [
    { key: "image", header: "Image", className: "w-16", render: (p) => <Thumb src={getImage(p)} /> },
    {
      key: "title",
      header: "Title",
      render: (p) => (
        <>
          <span className="block max-w-64 truncate font-medium text-ink" title={p.title}>
            {p.title}
          </span>
          <span className="block text-xs text-gray-500 xl:hidden">{p.brand}</span>
        </>
      ),
    },
    { key: "brand", header: "Brand", className: "hidden xl:table-cell", render: (p) => p.brand || "-" },
    {
      key: "category",
      header: "Category",
      className: "hidden lg:table-cell",
      render: (p) => getCategoryLabel(p.category),
    },
    {
      key: "price",
      header: "Price",
      render: (p) => <ProductPrice price={p.price} discountPrice={p.discountPrice} />,
    },
    { key: "stock", header: "Stock", render: (p) => <StockBadge stock={p.totalStock} /> },
    { key: "status", header: "Status", render: renderSwitch },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (p) => <ProductRowActions product={p} onDelete={onDelete} />,
    },
  ];

  const mobileCard = (product) => (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Thumb src={getImage(product)} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{product.title}</p>
          <p className="truncate text-sm text-gray-500">
            {[product.brand, getCategoryLabel(product.category)].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-1">
            <ProductPrice price={product.price} discountPrice={product.discountPrice} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-500">Stock</p>
          <StockBadge stock={product.totalStock} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        {renderSwitch(product)}
        <ProductRowActions product={product} onDelete={onDelete} />
      </div>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={products}
      loading={loading}
      mobileCard={mobileCard}
      emptyState={emptyState}
    />
  );
}