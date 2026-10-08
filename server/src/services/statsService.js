import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const LOW_STOCK_THRESHOLD = 5;
const LOW_STOCK_LIMIT = 10;
const TOP_PRODUCTS_LIMIT = 5;
const RECENT_ORDERS_LIMIT = 5;
const MONTHS = 12;
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// A "sale" = not cancelled AND (cash on delivery OR actually paid).
// An unpaid Stripe order is only a reservation (it is auto-cancelled after 30 minutes), not a sale.
const SALES_FILTER = {
  status: { $ne: "cancelled" },
  $or: [{ paymentMethod: "cod" }, { isPaid: true }],
};

const round2 = (n) => Math.round((n ?? 0) * 100) / 100;

const getTotalSales = async () => {
  const [result] = await Order.aggregate([
    { $match: SALES_FILTER },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  return round2(result?.total);
};

// First day (UTC) of each of the last 12 months, oldest first, current month last
const getMonthStarts = () => {
  const now = new Date();
  return Array.from({ length: MONTHS }, (_, i) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1 - i), 1))
  );
};

const getSalesByMonth = async () => {
  const monthStarts = getMonthStarts();
  const rows = await Order.aggregate([
    { $match: { ...SALES_FILTER, createdAt: { $gte: monthStarts[0] } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" } },
        sales: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const byMonth = new Map(rows.map((row) => [row._id, row]));
  // Months without sales are returned as zeros so charts have no gaps
  return monthStarts.map((date) => {
    const month = date.toISOString().slice(0, 7);
    const row = byMonth.get(month);
    return { month, sales: round2(row?.sales), orders: row?.orders ?? 0 };
  });
};

// Uses the order snapshot (title/image/price), so deleted products still appear in old stats
const getTopProducts = async () => {
  const rows = await Order.aggregate([
    { $match: SALES_FILTER },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        title: { $first: "$items.title" },
        image: { $first: "$items.image" },
        quantitySold: { $sum: "$items.qty" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
      },
    },
    { $sort: { quantitySold: -1, revenue: -1 } },
    { $limit: TOP_PRODUCTS_LIMIT },
  ]);
  return rows.map(({ _id, revenue, ...rest }) => ({
    product: _id,
    ...rest,
    revenue: round2(revenue),
  }));
};

const getLowStockProducts = () =>
  Product.aggregate([
    { $match: { isActive: true } },
    { $addFields: { totalStock: { $sum: "$variants.stock" } } },
    { $match: { totalStock: { $lte: LOW_STOCK_THRESHOLD } } },
    { $sort: { totalStock: 1, title: 1 } },
    { $limit: LOW_STOCK_LIMIT },
    {
      $project: {
        title: 1,
        slug: 1,
        totalStock: 1,
        image: { $arrayElemAt: ["$images.url", 0] },
      },
    },
  ]);

// Always returns all five statuses (zero when empty) so the UI never has to guess
const getOrdersByStatus = async () => {
  const rows = await Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const counts = new Map(rows.map((row) => [row._id, row.count]));
  return ORDER_STATUSES.map((status) => ({ status, count: counts.get(status) ?? 0 }));
};

// Only fields the dashboard needs: no items, no paymentIntentId, only name/email of the user
const getRecentOrders = () =>
  Order.find()
    .select("user totalPrice status isPaid paymentMethod createdAt")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(RECENT_ORDERS_LIMIT)
    .lean();

export const getDashboardStats = async () => {
  const [
    totalSales,
    usersCount,
    productsCount,
    lowStockProducts,
    salesByMonth,
    topProducts,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    getTotalSales(),
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    getLowStockProducts(),
    getSalesByMonth(),
    getTopProducts(),
    getOrdersByStatus(),
    getRecentOrders(),
  ]);

  const ordersCount = ordersByStatus.reduce((sum, row) => sum + row.count, 0);
  const pendingOrders = ordersByStatus.find((row) => row.status === "pending")?.count ?? 0;

  return {
    totalSales,
    ordersCount,
    usersCount,
    productsCount,
    pendingOrders,
    lowStockProducts,
    salesByMonth,
    topProducts,
    ordersByStatus,
    recentOrders,
  };
};