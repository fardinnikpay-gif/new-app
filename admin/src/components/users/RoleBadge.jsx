import { ADMIN_ROLE } from "../../utils/constants";
import { getRoleLabel } from "../../utils/user";
import Badge from "../ui/Badge";

export default function RoleBadge({ role }) {
  return <Badge tone={role === ADMIN_ROLE ? "primary" : "neutral"}>{getRoleLabel(role)}</Badge>;
}