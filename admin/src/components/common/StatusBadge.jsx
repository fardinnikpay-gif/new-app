import Badge from "../ui/Badge";

const TONES = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

export default function StatusBadge({ status }) {
  return (
    <Badge tone={TONES[status] ?? "neutral"} className="capitalize">
      {status}
    </Badge>
  );
}