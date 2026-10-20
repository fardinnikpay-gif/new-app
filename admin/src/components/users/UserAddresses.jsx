import ShippingAddress from "../orders/ShippingAddress";
import Badge from "../ui/Badge";

// The shape of an address is not in the API table, so ShippingAddress shows every filled
// text field with a readable label. `isDefault: true` (if present) gets a badge.
export default function UserAddresses({ addresses }) {
  if (addresses.length === 0) {
    return <p className="text-sm text-gray-500">No saved addresses.</p>;
  }

  return (
    <ul className="space-y-3">
      {addresses.map((address, index) => (
        <li key={address?._id ?? index} className="rounded-lg border border-gray-200 p-3">
          {address?.isDefault === true && (
            <div className="mb-2">
              <Badge tone="info">Default</Badge>
            </div>
          )}
          <ShippingAddress address={address} emptyText="This address is empty." />
        </li>
      ))}
    </ul>
  );
}