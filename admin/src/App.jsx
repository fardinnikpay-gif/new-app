import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

// A data router is required for useBlocker (unsaved-changes warning).
// The "*" route hands every URL to the existing <Routes> tree in AppRoutes.
function Root() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

const router = createBrowserRouter([{ path: "*", element: <Root /> }]);

export default function App() {
  return <RouterProvider router={router} />;
}