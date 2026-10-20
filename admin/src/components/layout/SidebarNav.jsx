import { NavLink } from "react-router-dom";
import { cx } from "../../utils/cx";
import { NAV_ITEMS } from "../../utils/navigation";

// Shared by the desktop Sidebar and the mobile Drawer.
// When collapsed, labels stay in the DOM (sr-only) so screen readers still get names.
export default function SidebarNav({ collapsed = false, onNavigate }) {
  return (
    <nav aria-label="Main">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary-dark"
                    : "text-gray-700 hover:bg-gray-100 hover:text-ink"
                )
              }
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className={cx(collapsed && "sr-only")}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}