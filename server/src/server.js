import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { startCleanupJob } from "./jobs/cleanupUnpaidOrders.js";

// right after app.listen(...)
startCleanupJob();
let shuttingDown = false;

const shutdown = (server, reason, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${reason}: shutting down...`);

  // Safety net: force exit if connections do not close in time
  setTimeout(() => process.exit(1), 10000).unref();

  server.closeIdleConnections?.();
  server.close(async () => {
    await disconnectDB();
    process.exit(exitCode);
  });
};

const start = async () => {
  await connectDB(config.mongoUri);

  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });

  startCleanupJob();

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${config.port} is already in use`);
    } else {
      console.error(`Server error: ${err.message}`);
    }
    process.exit(1);
  });

  process.on("SIGINT", () => shutdown(server, "SIGINT"));
  process.on("SIGTERM", () => shutdown(server, "SIGTERM"));
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdown(server, "unhandledRejection", 1);
  });
};

start().catch((err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});