import { ADMIN_ROLE, ROLE_LABELS } from "./constants";

export const isAdminUser = (user) => user?.role === ADMIN_ROLE;

// Admin accounts are never deletable from the panel. This also covers deleting yourself,
// because the signed-in user is always an admin. UX only: the backend must enforce it.
export const canDeleteUser = (user) => !isAdminUser(user);

export const getUserDisplayName = (user) =>
  user?.name || user?.email || user?.phone || "Unnamed user";

export const getRoleLabel = (role) => {
  if (!role) return "-";
  const text = String(role);
  return ROLE_LABELS[text] ?? text.charAt(0).toUpperCase() + text.slice(1);
};

// Saved addresses from GET /admin/users/:id. If the backend uses another field name,
// this is the only place to change.
export const getAddresses = (user) => (Array.isArray(user?.addresses) ? user.addresses : []);