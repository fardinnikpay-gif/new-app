import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cx } from "../../utils/cx";
import Reveal from "../motion/Reveal";

const TITLE_DELAY_S = 0.1;

export default function HomeSectionHeader({ eyebrow, title, to, linkLabel = "View all", tone = "light" }) {
  const dark = tone === "dark";

  return (
    <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
      <div>
        <Reveal
          as="p"
          className={cx("mb-3 text-sm uppercase tracking-widest", dark ? "text-accent" : "text-primary")}
        >
          {eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          delay={TITLE_DELAY_S}
          className={cx("text-3xl font-light tracking-tight md:text-5xl", dark ? "text-white" : "text-ink")}
        >
          {title}
        </Reveal>
      </div>

      {to && (
        <Link
          to={to}
          className={cx(
            "inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline",
            dark ? "text-white" : "text-ink"
          )}
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}