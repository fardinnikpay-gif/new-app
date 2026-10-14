import { useState } from "react";
import { Navigate, Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../routes/ProtectedRoute";
import AccountNav from "../../components/account/AccountNav";
import Reveal from "../../components/motion/Reveal";
import Container from "../../components/ui/Container";

const PAGE_TRANSITION = { duration: 0.25 };

function AccountShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const atRoot = useMatch({ path: "/account", end: true });
  const [loggingOut, setLoggingOut] = useState(false);

  if (atRoot) return <Navigate to="/account/profile" replace />;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const firstName = (user?.name ?? "").split(" ")[0];

  return (
    <Container className="pb-16 pt-8 md:pb-24 md:pt-12">
      <Reveal as="h1" className="text-4xl font-light tracking-tight text-ink md:text-5xl">
        My account
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <aside>
          {firstName && (
            <p className="mb-4 hidden px-4 text-sm text-neutral-600 lg:block">
              Hi, <span className="font-medium text-ink">{firstName}</span>
            </p>
          )}
          <AccountNav onLogout={handleLogout} loggingOut={loggingOut} />
        </aside>

        <motion.div
          key={location.pathname}
          className="min-w-0"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={PAGE_TRANSITION}
        >
          <Outlet />
        </motion.div>
      </div>
    </Container>
  );
}

// ProtectedRoute guards every /account/* page (guests go to /login and come back).
export default function AccountLayout() {
  return (
    <ProtectedRoute>
      <AccountShell />
    </ProtectedRoute>
  );
}