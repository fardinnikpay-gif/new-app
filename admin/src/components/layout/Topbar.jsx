import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getPageTitle } from "../../utils/navigation";
import AdminMenu from "./AdminMenu";

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-ink lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <p className="min-w-0 flex-1 truncate text-base font-semibold text-ink">
        {getPageTitle(pathname)}
      </p>
      <AdminMenu />
    </header>
  );
}