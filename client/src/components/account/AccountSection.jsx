import { cx } from "../../utils/cx";

// Title + description + content block shared by all account pages.
// narrow: forms stay readable (pass narrow={false} for lists/tables).
export default function AccountSection({ title, description, narrow = true, children }) {
  return (
    <section className={cx(narrow && "max-w-xl")}>
      <h2 className="text-2xl font-light tracking-tight text-ink md:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-neutral-600">{description}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}