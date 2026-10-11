import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageSkeleton from "../components/common/PageSkeleton";
import PageTransition from "../components/motion/PageTransition";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
// remove:  import PageTransition from "../components/motion/PageTransition";
import Layout from "../components/layout/Layout";

const Home = lazy(() => import("../pages/Home"));
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const AccountLayout = lazy(() => import("../pages/account/AccountLayout"));
const Profile = lazy(() => import("../pages/account/Profile"));
const Addresses = lazy(() => import("../pages/account/Addresses"));
const Orders = lazy(() => import("../pages/account/Orders"));
const OrderDetail = lazy(() => import("../pages/account/OrderDetail"));
const Wishlist = lazy(() => import("../pages/account/Wishlist"));
const ChangePassword = lazy(() => import("../pages/account/ChangePassword"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const FAQ = lazy(() => import("../pages/FAQ"));
const SizeGuide = lazy(() => import("../pages/SizeGuide"));
const Terms = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/Privacy"));
const NotFound = lazy(() => import("../pages/NotFound"));

// <Routes location={location}> is required: the page that is fading out must keep rendering its old route.
export default function AppRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route
            path="/checkout/success/:orderId"
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
          />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}