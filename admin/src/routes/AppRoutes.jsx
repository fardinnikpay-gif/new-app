import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FullPageSpinner from "../components/common/FullPageSpinner";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Products = lazy(() => import("../pages/Products"));
const ProductCreate = lazy(() => import("../pages/ProductCreate"));
const ProductEdit = lazy(() => import("../pages/ProductEdit"));
const Categories = lazy(() => import("../pages/Categories"));
const Orders = lazy(() => import("../pages/Orders"));
const Coupons = lazy(() => import("../pages/Coupons"));
const Users = lazy(() => import("../pages/Users"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Everything below requires a signed-in admin. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/:id/edit" element={<ProductEdit />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}