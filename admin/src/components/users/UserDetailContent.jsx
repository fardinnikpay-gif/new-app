import { UserX } from "lucide-react";
import { getAdminUser } from "../../api/userApi";
import useAsync from "../../hooks/useAsync";
import { formatDateTime, formatNumber } from "../../utils/format";
import { getAddresses, getUserDisplayName } from "../../utils/user";
import DetailSection from "../orders/DetailSection";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import RoleBadge from "./RoleBadge";
import UserAddresses from "./UserAddresses";
import UserDetailSkeleton from "./UserDetailSkeleton";

// 400 is included because an invalid ObjectId usually fails as a cast error.
const NOT_FOUND_STATUSES = [404, 400];

function ContactLink({ href, children }) {
  if (!children) return <span className="text-gray-500">-</span>;
  return (
    <a href={href} className="break-all text-primary-dark hover:underline">
      {children}
    </a>
  );
}

// Mounts only while the modal is open, so every open fetches fresh data.
export default function UserDetailContent({ userId }) {
  const { data, error, reload } = useAsync((signal) => getAdminUser(userId, signal), [userId]);

  if (!data) {
    if (error && NOT_FOUND_STATUSES.includes(error.status)) {
      return (
        <EmptyState
          icon={UserX}
          title="User not found"
          message="The account may have been deleted, or the link is wrong."
        />
      );
    }
    if (error) {
      return <ErrorState title="Could not load the user" message={error.message} onRetry={reload} />;
    }
    return <UserDetailSkeleton />;
  }

  const { user, ordersCount } = data;
  const addresses = getAddresses(user);

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="min-w-0 break-words text-lg font-semibold text-ink">
          {getUserDisplayName(user)}
        </p>
        <RoleBadge role={user.role} />
      </div>

      <DetailSection title="Contact">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Email</dt>
          <dd>
            <ContactLink href={`mailto:${user.email}`}>{user.email}</ContactLink>
          </dd>
          <dt className="text-gray-500">Phone</dt>
          <dd>
            <ContactLink href={`tel:${user.phone}`}>{user.phone}</ContactLink>
          </dd>
          <dt className="text-gray-500">Joined</dt>
          <dd className="text-ink">{formatDateTime(user.createdAt)}</dd>
        </dl>
      </DetailSection>

      <DetailSection title="Orders">
        <p className="text-sm text-gray-600">
          <span className="mr-2 text-2xl font-bold text-ink">{formatNumber(ordersCount)}</span>
          {Number(ordersCount) === 1 ? "order" : "orders"} placed
        </p>
      </DetailSection>

      <DetailSection title={`Addresses (${addresses.length})`}>
        <UserAddresses addresses={addresses} />
      </DetailSection>
    </div>
  );
}