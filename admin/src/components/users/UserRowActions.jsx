import { Eye, Trash2 } from "lucide-react";
import { canDeleteUser, getUserDisplayName } from "../../utils/user";
import IconButton from "../ui/IconButton";

// Delete is never offered for admin accounts. An empty slot of the same size (size-9 =
// icon + padding of IconButton) keeps the View buttons aligned across rows.
export default function UserRowActions({ user, onView, onDelete }) {
  const name = getUserDisplayName(user);

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton icon={Eye} label={`View ${name}`} onClick={() => onView(user)} />
      {canDeleteUser(user) ? (
        <IconButton
          icon={Trash2}
          tone="danger"
          label={`Delete ${name}`}
          onClick={() => onDelete(user)}
        />
      ) : (
        <span aria-hidden="true" className="size-9" />
      )}
    </div>
  );
}