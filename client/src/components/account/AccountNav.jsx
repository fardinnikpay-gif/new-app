import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { accountNav } from "../../data/accountNav";
import { cx } from "../../utils/cx";

const ITEM = "flex min-h-11 items-center gap-3 rounded-md px-4 text-sm transition-colors";

// Vertical sidebar on desktop, horizontally scrollable tabs on phone/tablet (same markup).
export default function AccountNav({ onLogout, loggingOut }) {
  return (
    <nav aria-label="Account" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <ul className="flex gap-2 lg:flex-col lg:gap-1">
        {accountNav.map(({ to, label, icon: Icon }) => (
          <li key={to} className="shrink-0">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cx(
                  ITEM,
                  isActive
                    ? "bg-neutral-100 font-medium text-ink"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-ink"
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
        <li className="shrink-0 lg:mt-4 lg:border-t lg:border-neutral-200 lg:pt-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className={cx(
              ITEM,
              "w-full text-neutral-600 hover:bg-neutral-50 hover:text-ink disabled:opacity-50"
            )}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}