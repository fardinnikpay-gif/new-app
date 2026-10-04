import mongoose from "mongoose";

mongoose.set("strictQuery", true);

let listenersAttached = false;

const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;
  mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));
  mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));
  mongoose.connection.on("error", (err) => console.error(`MongoDB error: ${err.message}`));
};

/**
 * Connects to MongoDB. Logs and exits the process if the first connection fails.
 * The URI is never logged (it may contain credentials).
 */
export const connectDB = async (uri) => {
  if (mongoose.connection.readyState === 1) return; // already connected
  attachListeners();

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected: ${host}/${name}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

/** Closes the connection (graceful shutdown and tests). */
export const disconnectDB = async () => {
  await mongoose.disconnect();
};