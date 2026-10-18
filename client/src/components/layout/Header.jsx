import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getBrands } from "../../api/productApi";
import { DURATION, EASE } from "../../animations/variants";
import { useCart } from "../../context/useCart";
import { useUI } from "../../context/useUI";
import { useWishlist } from "../../context/useWishlist";
import { OVERLAY_HEADER_ROUTES } from "../../data/navigation";
import { SITE_NAME } from "../../data/site";
import useAsync from "../../hooks/useAsync";
import useHeaderScroll from "../../hooks/useHeaderScroll";
import useMediaQuery from "../../hooks/useMediaQuery";
import { CART_BUMP_EVENT } from "../../utils/cart";
import { cx } from "../../utils/cx";
import { QUERIES } from "../../utils/media";
import Container from "../ui/Container";
import DesktopNav from "./DesktopNav";
import HeaderAction from "./HeaderAction";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

// Transparent over a Hero at the top of the page, white with a soft shadow after scrolling.
// Hides when scrolling down and returns when scrolling up (never while a menu is open or focused).
export default function Header() {
  const { pathname } = useLocation();
  const { scrolled, hidden } = useHeaderScroll();
  const { megaMenuOpen, mobileMenuOpen, openSearch, openMobileMenu, closeMobileMenu, closeAll } = useUI();
  const { totalCount } = useCart();
  const { ids } = useWishlist();
  const isDesktop = useMediaQuery(QUERIES.desktop);
  const brandsRequest = useAsync(({ signal }) => getBrands({ signal }), []);
  const [focusWithin, setFocusWithin] = useState(false);

  const brands = brandsRequest.data?.brands ?? [];
  const panelOpen = megaMenuOpen || mobileMenuOpen;
  const overlay = OVERLAY_HEADER_ROUTES.includes(pathname) && !scrolled && !panelOpen;

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (isDesktop) closeMobileMenu();
  }, [isDesktop, closeMobileMenu]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
  };

  const logo = (
    <Link to="/" aria-label={`${SITE_NAME} home`} className="text-xl font-medium tracking-tight">
      {SITE_NAME}
    </Link>
  );

  return (
    <motion.header
      animate={{ y: hidden && !panelOpen && !focusWithin ? "-100%" : 0 }}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      onFocus={() => setFocusWithin(true)}
      onBlur={handleBlur}
      className={cx(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        overlay ? "bg-transparent text-surface" : "bg-surface text-ink",
        !overlay && (scrolled ? "shadow-soft" : "border-b border-line")
      )}
    >
      <div style={{ paddingRight: "var(--scroll-lock-gap, 0px)" }}>
        <Container className="grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center justify-self-start">
            {isDesktop ? (
              logo
            ) : (
              <HeaderAction
                label="Open menu"
                icon={Menu}
                onClick={openMobileMenu}
                aria-expanded={mobileMenuOpen}
                className="-ml-3"
              />
            )}
          </div>

          <div className="justify-self-center">
            {isDesktop ? <DesktopNav brands={brands} /> : logo}
          </div>

          <div className="flex items-center justify-self-end">
            <HeaderAction label="Search" icon={Search} onClick={openSearch} />
            {isDesktop && <HeaderAction to="/account/wishlist" label="Wishlist" icon={Heart} count={ids.size} />}
            {isDesktop && <UserMenu />}
            <HeaderAction
              to="/cart"
              label="Cart"
              icon={ShoppingBag}
              count={totalCount}
              bumpEvent={CART_BUMP_EVENT}
              className="md:mr-0 max-md:-mr-3"
            />
          </div>
        </Container>
      </div>
      {!isDesktop && <MobileMenu />}
    </motion.header>
  );
}