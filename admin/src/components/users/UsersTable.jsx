import { Trash2 } from "lucide-react";
import { formatDate } from "../../utils/format";
import { canDeleteUser, getUserDisplayName } from "../../utils/user";
import DataTable from "../common/DataTable";
import IconButton from "../ui/IconButton";
import RoleBadge from "./RoleBadge";
import UserRowActions from "./UserRowActions";

// Table from md up, cards below. Columns drop out as the screen narrows:
// phone below lg, joined date below xl (both are in the detail modal).
// onView(user) opens the detail modal; onDelete(user) asks for confirmation.
export default function UsersTable({ users, loading = false, onView, onDelete, emptyState }) {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <span className="block max-w-48 truncate" title={getUserDisplayName(user)}>
          {getUserDisplayName(user)}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user) => (
        <span className="block max-w-56 truncate" title={user.email}>
          {user.email || "-"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      className: "hidden whitespace-nowrap lg:table-cell",
      render: (user) => user.phone || "-",
    },
    { key: "role", header: "Role", render: (user) => <RoleBadge role={user.role} /> },
    {
      key: "joined",
      header: "Joined",
      className: "hidden xl:table-cell",
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (user) => <UserRowActions user={user} onView={onView} onDelete={onDelete} />,
    },
  ];

  const mobileCard = (user, open) => (
    <div className="space-y-3">
      {/* A real button, so the card is reachable and usable with the keyboard. */}
      <button
        type="button"
        onClick={open}
        className="flex w-full items-start justify-between gap-3 rounded-lg text-left"
      >
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">{getUserDisplayName(user)}</span>
          <span className="block truncate text-sm text-gray-600">{user.email || "-"}</span>
          <span className="block text-sm text-gray-600">{user.phone || "-"}</span>
          <span className="block text-xs text-gray-500">Joined {formatDate(user.createdAt)}</span>
        </span>
        <RoleBadge role={user.role} />
      </button>
      {canDeleteUser(user) && (
        <div className="flex justify-end border-t border-gray-100 pt-3">
          <IconButton
            icon={Trash2}
            tone="danger"
            label={`Delete ${getUserDisplayName(user)}`}
            onClick={() => onDelete(user)}
          />
        </div>
      )}
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={users}
      loading={loading}
      onRowClick={onView}
      mobileCard={mobileCard}
      emptyState={emptyState}
    />
  );
}