import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/cx";

// Accessible accordion: button inside a heading, aria-expanded / aria-controls, any number open.
// Height animates through grid-template-rows; closed panels are `invisible` (out of tab order).
export default function FaqAccordion({ items }) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item) => {
        const open = openIds.has(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left text-ink"
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cx(
                    "h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none",
                    open && "rotate-180"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cx(
                "grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none",
                open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-neutral-600">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}