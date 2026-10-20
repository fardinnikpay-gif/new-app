import { CANCELLED_STATUS } from "../../utils/constants";
import Badge from "../ui/Badge";

export default function PaymentBadge({ order }) {
  if (order.isPaid) return <Badge tone="success">Paid</Badge>;
  return <Badge tone={order.status === CANCELLED_STATUS ? "neutral" : "warning"}>Unpaid</Badge>;
}