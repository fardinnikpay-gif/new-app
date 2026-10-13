import { useId } from "react";

export default function FilterGroup({ title, children }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className="border-b border-neutral-200 py-6 first:pt-0">
      <h3 id={titleId} className="mb-3 text-sm font-medium uppercase tracking-widest text-ink">
        {title}
      </h3>
      {children}
    </div>
  );
}