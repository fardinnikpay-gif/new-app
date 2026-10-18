import { useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import ErrorPage from "./ErrorPage";

// Route-level boundary: the header and footer stay, and navigating away clears the error.
export default function RouteErrorBoundary({ children }) {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary
      resetKey={pathname}
      fallback={({ error, reset }) => <ErrorPage error={error} onRetry={reset} />}
    >
      {children}
    </ErrorBoundary>
  );
}