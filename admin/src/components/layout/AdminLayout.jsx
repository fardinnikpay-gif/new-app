import { Suspense, useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { getPageTitle } from "../../utils/navigation";
import useSidebarCollapsed from "../../hooks/useSidebarCollapsed";
import { DESKTOP_QUERY, SITE_NAME } from "../../utils/constants";
import { cx } from "../../utils/cx";
import Drawer from "../ui/Drawer";
import Spinner from "../ui/Spinner";
import Sidebar from "./Sidebar";
import SidebarNav from "./SidebarNav";
import Topbar from "./Topbar";


const MAIN_ID = "main-content";

export default function AdminLayout() {
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const { pathname } = useLocation();
  useDocumentTitle(`${getPageTitle(pathname)} · ${SITE_NAME} Admin`);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The drawer is mobile/tablet only: close it if the window grows to desktop size.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  return (
    <div className="min-h-dvh">
      <a
        href={`#${MAIN_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-overlay"
      >
        Skip to content
      </a>

      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      <div
        className={cx(
          "flex min-h-dvh flex-col transition-[padding]",
          collapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <Topbar onMenuClick={openMenu} />
        <main
          id={MAIN_ID}
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 p-4 outline-none sm:p-6"
        >
          {/* Suspense here keeps the layout visible while a lazy page loads. */}
          <Suspense
            fallback={
              <div className="flex justify-center py-20 text-primary">
                <Spinner size="lg" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      <Drawer open={menuOpen} onClose={closeMenu} title={SITE_NAME} side="left" size="sm">
        <SidebarNav onNavigate={closeMenu} />
      </Drawer>
    </div>
  );
}