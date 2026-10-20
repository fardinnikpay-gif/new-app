export default function DetailSection({ title, children }) {
  return (
    <section className="border-t border-gray-100 py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      {children}
    </section>
  );
}