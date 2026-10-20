// customer: { name, email, phone } or null when it is not available.
export default function OrderCustomer({ customer }) {
  if (!customer) {
    return <p className="text-sm text-gray-500">Customer details are not available.</p>;
  }

  const linkClass = "text-primary-dark hover:underline";

  return (
    <dl className="space-y-1 text-sm">
      <div>
        <dt className="sr-only">Name</dt>
        <dd className="font-medium text-ink">{customer.name || "-"}</dd>
      </div>
      {customer.email && (
        <div>
          <dt className="sr-only">Email</dt>
          <dd>
            <a href={`mailto:${customer.email}`} className={linkClass}>
              {customer.email}
            </a>
          </dd>
        </div>
      )}
      {customer.phone && (
        <div>
          <dt className="sr-only">Phone</dt>
          <dd>
            <a href={`tel:${customer.phone}`} className={linkClass}>
              {customer.phone}
            </a>
          </dd>
        </div>
      )}
    </dl>
  );
}