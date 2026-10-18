import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DURATION, EASE } from "../../animations/variants";
import { useAuth } from "../../context/useAuth";
import HeaderAction from "./HeaderAction";

const ITEM = "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-neutral-100";

// Dropdown for the account: Profile / Orders / Wishlist / Logout, or Login / Register for guests.
export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      close();
      rootRef.current?.querySelector("button")?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  const handleLogout = async () => {
    close();
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
    <div ref={rootRef} className="relative">
      <HeaderAction
        label="Account"
        icon={User}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="user-menu"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            id="user-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
            className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-line bg-surface p-2 text-ink shadow-lift"
          >
            {user ? (
              <>
                <p className="truncate px-3 py-2 text-sm font-medium">{user.name}</p>
                <Link to="/account/profile" onClick={close} className={ITEM}>Profile</Link>
                <Link to="/account/orders" onClick={close} className={ITEM}>Orders</Link>
                <Link to="/account/wishlist" onClick={close} className={ITEM}>Wishlist</Link>
                <button type="button" onClick={handleLogout} className={ITEM}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close} className={ITEM}>Login</Link>
                <Link to="/register" onClick={close} className={ITEM}>Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}