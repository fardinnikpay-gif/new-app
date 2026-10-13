import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { careContent, productTabs, shippingContent } from "../../data/productContent";
import { cx } from "../../utils/cx";

const PANEL_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

function InfoList({ items }) {
  return (
    <dl className="space-y-5">
      {items.map((item) => (
        <div key={item.title}>
          <dt className="text-sm font-medium text-ink">{item.title}</dt>
          <dd className="mt-1 text-neutral-600">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProductTabs({ product }) {
  const baseId = useId();
  const [active, setActive] = useState(productTabs[0].id);
  const tabRefs = useRef([]);
  const paragraphs = (product.description || "").split(/\n+/).filter(Boolean);

  const handleKeyDown = (event, index) => {
    const last = productTabs.length - 1;
    const targets = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const next = targets[event.key];
    setActive(productTabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const renderPanel = () => {
    if (active === "shipping") return <InfoList items={shippingContent} />;
    if (active === "care") return <InfoList items={careContent} />;
    if (!paragraphs.length) return <p className="text-neutral-600">No description available.</p>;
    return (
      <div className="space-y-4 text-neutral-600">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    );
  };

  return (
    <section className="mt-16 md:mt-24">
      <div role="tablist" aria-label="Product details" className="flex overflow-x-auto border-b border-neutral-200">
        {productTabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cx(
                "relative min-h-11 shrink-0 px-4 text-sm transition-colors md:px-6",
                selected ? "font-medium text-ink" : "text-neutral-600 hover:text-ink"
              )}
            >
              {tab.label}
              {selected && (
                <motion.span
                  layoutId={`${baseId}-underline`}
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-ink"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className="max-w-3xl py-8"
          {...PANEL_MOTION}
        >
          {renderPanel()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}