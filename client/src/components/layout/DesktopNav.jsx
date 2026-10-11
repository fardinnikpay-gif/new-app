import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import { NAV_CATEGORIES, SALE_LINK } from "../../data/navigation";
import { shopUrl } from "../../utils/navigation";
import MegaMenu from "./MegaMenu";

const CLOSE_DELAY_MS = 150;

const LINK_CLASS =
  "relative flex h-[var(--header-height)] items-center px-4 text-sm font-medium tracking-wide " +
  "after:absolute after:inset-x-4 after:bottom-6 after:h-px after:origin-left after:scale-x-0 after:bg-current " +
  "after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100 data-[active=true]:after:scale-x-100";

// props: { brands[] } | main links; Men/Women/Kids open the mega menu on hover or focus
export default function DesktopNav({ brands }) {
  const { search, pathname } = useLocation();
  const { megaMenuOpen, openMegaMenu, closeMegaMenu } = useUI();
  const [activeId, setActiveId] = useState(null);
  const closeTimerRef = useRef(null);
  const triggerRefs = useRef({});

  const cancelClose = () => window.clearTimeout(closeTimerRef.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(closeMegaMenu, CLOSE_DELAY_MS);
  };
  const open = (id) => {
    cancelClose();
    setActiveId(id);
    openMegaMenu();
  };

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  useEffect(() => {
    if (!megaMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      closeMegaMenu();
      triggerRefs.current[activeId]?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [megaMenuOpen, activeId, closeMegaMenu]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMegaMenu();
  };

  // ArrowDown moves keyboard focus from the trigger into the panel
  const handleTriggerKeyDown = (event, id) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    open(id);
    window.requestAnimationFrame(() => document.getElementById("mega-menu")?.querySelector("a")?.focus());
  };

  const params = new URLSearchParams(search);
  const isCategoryActive = (item) => pathname === "/shop" && params.get("category") === item.category;
  const isSaleActive = pathname === "/shop" && params.get("onSale") === "true";
  const activeItem = NAV_CATEGORIES.find((item) => item.id === activeId);

  return (
    <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose} onBlur={handleBlur}>
      <nav aria-label="Main" className="flex items-center">
        {NAV_CATEGORIES.map((item) => (
          <Link
            key={item.id}
            ref={(node) => {
              triggerRefs.current[item.id] = node;
            }}
            to={shopUrl({ category: item.category })}
            data-active={isCategoryActive(item)}
            aria-current={isCategoryActive(item) ? "page" : undefined}
            aria-expanded={megaMenuOpen && activeId === item.id}
            aria-controls="mega-menu"
            onMouseEnter={() => open(item.id)}
            onFocus={() => open(item.id)}
            onKeyDown={(event) => handleTriggerKeyDown(event, item.id)}
            onClick={closeMegaMenu}
            className={LINK_CLASS}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to={SALE_LINK.to}
          data-active={isSaleActive}
          aria-current={isSaleActive ? "page" : undefined}
          onMouseEnter={scheduleClose}
          onFocus={closeMegaMenu}
          className={LINK_CLASS}
        >
          {SALE_LINK.label}
        </Link>
      </nav>

      <AnimatePresence>
        {megaMenuOpen && activeItem && (
          <MegaMenu key="mega" item={activeItem} brands={brands} onNavigate={closeMegaMenu} />
        )}
      </AnimatePresence>
    </div>
  );
}