import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DURATION } from "../../animations/variants";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { useWishlist } from "../../context/WishlistContext";
import { NAV_CATEGORIES, SALE_LINK } from "../../data/navigation";
import { cx } from "../../utils/cx";
import { shopUrl } from "../../utils/navigation";
import Drawer from "../ui/Drawer";

const ROW = "flex min-h-12 w-full items-center justify-between text-lg";

// Full-width drawer with category accordions. Expanding is instant on purpose (only opacity fades in),
// because the project animates only transform and opacity.
export default function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu } = useUI();
  const { user, logout } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);

  const handleLogout = async () => {
    closeMobileMenu();
    try {
      await logout();
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      navigate("/");
    }
  };

  return (
    <Drawer open={mobileMenuOpen} onClose={closeMobileMenu} side="left" width="full" title="Menu">
      <nav aria-label="Mobile" className="space-y-6">
        <ul className="divide-y divide-line">
          {NAV_CATEGORIES.map((item) => {
            const expanded = openId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-${item.id}`}
                  onClick={() => setOpenId(expanded ? null : item.id)}
                  className={ROW}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cx("h-5 w-5 transition-transform", expanded && "rotate-180")}
                  />
                </button>
                {expanded && (
                  <motion.ul
                    id={`mobile-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: DURATION.fast }}
                    className="pb-3 pl-3"
                  >
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={shopUrl(link.params)}
                          onClick={closeMobileMenu}
                          className="flex min-h-11 items-center text-neutral-600"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            );
          })}
          <li>
            <Link to={SALE_LINK.to} onClick={closeMobileMenu} className={ROW}>
              {SALE_LINK.label}
            </Link>
          </li>
        </ul>

        <ul className="space-y-1 border-t border-line pt-4 text-neutral-600">
          <li>
            <Link to="/account/wishlist" onClick={closeMobileMenu} className="flex min-h-11 items-center">
              Wishlist{ids.size > 0 ? ` (${ids.size})` : ""}
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/account/profile" onClick={closeMobileMenu} className="flex min-h-11 items-center">
                  Account
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className="flex min-h-11 w-full items-center text-left">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMobileMenu} className="flex min-h-11 items-center">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMobileMenu} className="flex min-h-11 items-center">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </Drawer>
  );
}