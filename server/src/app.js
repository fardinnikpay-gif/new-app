import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env.js";
import { sendSuccess } from "./utils/apiResponse.js";

const app = express();

// Behind a reverse proxy (Render, Nginx, ...) so req.ip and secure cookies work
if (config.isProduction) app.set("trust proxy", 1);

// client and admin are two different origins; cookies need credentials: true
app.use(cors({ origin: config.corsOrigins, credentials: true }));

if (!config.isTest) app.use(morgan(config.isProduction ? "combined" : "dev"));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  sendSuccess(res, 200, "Server is healthy", {
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default app;