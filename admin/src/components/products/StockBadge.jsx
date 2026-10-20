import { LOW_STOCK_THRESHOLD } from "../../utils/constants";
import { formatNumber } from "../../utils/format";
import Badge from "../ui/Badge";

export default function StockBadge({ stock }) {
  const count = Number(stock) || 0;

  if (count === 0) return <Badge tone="danger">Out of stock</Badge>;
  if (count <= LOW_STOCK_THRESHOLD) return <Badge tone="warning">{count} left</Badge>;
  return <span className="text-sm text-ink">{formatNumber(count)}</span>;
}