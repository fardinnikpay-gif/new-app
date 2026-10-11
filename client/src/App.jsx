import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import DevToolbar from "./components/common/DevToolbar";
import ScrollToTop from "./components/common/ScrollToTop";
import Toaster from "./components/common/Toaster";
import Preloader from "./components/motion/Preloader";
import ScrollProgress from "./components/motion/ScrollProgress";
import SmoothScroll from "./components/motion/SmoothScroll";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <UIProvider>
                <SmoothScroll>
                  <ScrollToTop />
                  <ScrollProgress />
                  <Preloader />
                  <AppRoutes />
                  <Toaster />
                  {import.meta.env.DEV && <DevToolbar />}
                </SmoothScroll>
              </UIProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </MotionConfig>
    </HelmetProvider>
  );
}