import { cx } from "../../utils/cx";

// props: { eyebrow, title, description, action (node), align: left|center, as, className }
export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  className,
}) {
  const centered = align === "center";

  return (
    <div
      className={cx(
        "flex flex-wrap items-end justify-between gap-4",
        centered && "flex-col items-center text-center",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow && <p className="text-sm font-medium uppercase tracking-widest text-primary">{eyebrow}</p>}
        <Heading className="text-3xl md:text-5xl">{title}</Heading>
        {description && <p className="max-w-xl text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}