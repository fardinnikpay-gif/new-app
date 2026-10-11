import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cx } from "../../utils/cx";

const BADGE_MAX = 99;
const BUMP_FROM_SCALE = 1.4;
const BUMP_SPRING = { type: "spring", stiffness: 500, damping: 18 };

// props: { to | onClick, label, icon: Icon, count, bumpEvent, className, ...rest }
// Icon button (44px) with an optional counter badge. When `bumpEvent` fires, the badge pops.
export default function HeaderAction({ to, onClick, label, icon: Icon, count = 0, bumpEvent, className, ...rest }) {
  const [bumpKey, setBumpKey] = useState(0);

  useEffect(() => {
    if (!bumpEvent) return undefined;
    const handleBump = () => setBumpKey((key) => key + 1);
    window.addEventListener(bumpEvent, handleBump);
    return () => window.removeEventListener(bumpEvent, handleBump);
  }, [bumpEvent]);

  const classes = cx(
    "relative grid h-11 w-11 place-items-center rounded-lg transition-colors hover:bg-current/10",
    className
  );
  const ariaLabel = count > 0 ? `${label} (${count})` : label;

  const content = (
    <>
      <Icon aria-hidden="true" className="h-5 w-5" />
      {count > 0 && (
        <motion.span
          key={bumpKey}
          initial={{ scale: BUMP_FROM_SCALE }}
          animate={{ scale: 1 }}
          transition={BUMP_SPRING}
          className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-medium leading-4 text-surface"
        >
          {count > BADGE_MAX ? `${BADGE_MAX}+` : count}
        </motion.span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={ariaLabel} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  );
}