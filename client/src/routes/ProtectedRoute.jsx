import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import RouteSpinner from "./RouteSpinner";

// props: { children } | guests are sent to /login and come back to the same page afterwards (state.from)
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}