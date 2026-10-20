import { useRouteError } from "react-router-dom";
import ErrorFallback from "../components/common/ErrorFallback";

// Fallback for errors that escape the ErrorBoundary (e.g. thrown by the router itself).
export default function RouteErrorPage() {
  return <ErrorFallback error={useRouteError()} />;
}