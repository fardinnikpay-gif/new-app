import Order from "../models/Order.js";
import * as orderService from "../services/orderService.js";
import * as paymentService from "../services/paymentService.js";

const UNPAID_TTL_MS = 30 * 60 * 1000;
const INTERVAL_MS = 5 * 60 * 1000;
const BATCH_SIZE = 100;

export const cleanupUnpaidOrders = async () => {
  const cutoff = new Date(Date.now() - UNPAID_TTL_MS);
  const staleOrders = await Order.find({
    paymentMethod: "stripe",
    isPaid: false,
    status: "pending",
    createdAt: { $lt: cutoff },
  })
    .select("_id paymentIntentId")
    .limit(BATCH_SIZE)
    .lean();

  let cancelledCount = 0;
  for (const stale of staleOrders) {
    try {
      // Atomic: if a webhook or another instance got there first, this returns null and nothing is restored twice
      const cancelled = await orderService.cancelPendingOrder({ _id: stale._id });
      if (!cancelled) continue;
      cancelledCount += 1;
      if (stale.paymentIntentId) await paymentService.cancelPaymentIntent(stale.paymentIntentId);
    } catch (error) {
      console.error(`Cleanup failed for order ${stale._id}:`, error.message);
    }
  }
  return cancelledCount;
};

export const startCleanupJob = () => {
  const timer = setInterval(() => {
    cleanupUnpaidOrders().catch((error) => console.error("Cleanup job failed:", error.message));
  }, INTERVAL_MS);
  timer.unref(); // does not keep the process alive on shutdown
  return timer;
};