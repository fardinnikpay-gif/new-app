import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env.js";
import { sendSuccess } from "./utils/apiResponse.js";
import { applySecurity } from "./middleware/security.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Behind a reverse proxy (Render, Nginx, ...) so req.ip and secure cookies work
if (config.isProduction) app.set("trust proxy", 1);

// client and admin are two different origins; cookies need credentials: true
app.use(cors({ origin: config.corsOrigins, credentials: true }));

if (!config.isTest) app.use(morgan(config.isProduction ? "combined" : "dev"));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// helmet, body sanitizing, general rate limiter
applySecurity(app);

app.get("/api/health", (req, res) => {
  sendSuccess(res, 200, "Server is healthy", {
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/cart", cartRoutes);
// Routes will be mounted here in later steps

app.use(notFound);
app.use(errorHandler);

export default app;