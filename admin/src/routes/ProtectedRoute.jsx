import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageSpinner from "../components/common/FullPageSpinner";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;
  if (!admin) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}