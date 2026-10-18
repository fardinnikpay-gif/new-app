import { Outlet } from "react-router-dom";
import PageTransition from "../motion/PageTransition";
import BackToTop from "./BackToTop";
import Footer from "./Footer";
import Header from "./Header";
import SearchOverlay from "./SearchOverlay";
import RouteErrorBoundary from "../common/RouteErrorBoundary";

// Page shell. <main> always keeps a padding-top equal to the Header height, so nothing shifts while pages fade.
// The Hero (step 11) slides under the Header with a negative margin.
export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:shadow-lift"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-[var(--header-height)] outline-none">
        <PageTransition>
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
      <SearchOverlay />
    </div>
  );
}

