export default function FormSection({ title, description, children }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-card">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}