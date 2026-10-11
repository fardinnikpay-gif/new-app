import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRedirectTarget } from "../utils/navigation";
import RouteSpinner from "./RouteSpinner";

// props: { children } | for login, register and password pages.
// This is the ONLY place that redirects after a successful login, so the Login page must not navigate itself.
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteSpinner />;
  if (user) return <Navigate to={getRedirectTarget(location)} replace />;
  return children;
}