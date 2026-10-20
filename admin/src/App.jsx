import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import RouteErrorPage from "./routes/RouteErrorPage";

// A data router is required for useBlocker (unsaved-changes warning).
// The "*" route hands every URL to the existing <Routes> tree in AppRoutes.
// ErrorBoundary wraps everything, auth included, so any crash gets a recoverable screen.
function Root() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  { path: "*", element: <Root />, errorElement: <RouteErrorPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}