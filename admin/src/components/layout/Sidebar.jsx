import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cx } from "../../utils/cx";
import { SITE_NAME } from "../../utils/constants";
import SidebarNav from "./SidebarNav";

// Desktop only (lg+). Below lg the same links live inside a Drawer.
export default function Sidebar({ collapsed, onToggle }) {
  const ToggleIcon = collapsed ? ChevronsRight : ChevronsLeft;

  return (
    <aside
      className={cx(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-gray-200 bg-white transition-[width] lg:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cx(
          "flex h-16 shrink-0 items-center border-b border-gray-200",
          collapsed ? "justify-center" : "px-5"
        )}
      >
        <span className="truncate text-lg font-bold text-primary" title={SITE_NAME}>
          {collapsed ? SITE_NAME.charAt(0).toUpperCase() : SITE_NAME}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="border-t border-gray-200 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cx(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-ink",
            collapsed && "justify-center"
          )}
        >
          <ToggleIcon className="size-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}