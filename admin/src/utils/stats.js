import { ORDER_STATUSES } from "./constants";
import { getShortOrderId } from "./order";

// Turns the raw GET /admin/stats response into the exact shapes the dashboard
// components expect. Missing or malformed fields become safe defaults, so one
// bad field never breaks the whole page.

const MONTH_KEY = /^(\d{4})-(\d{1,2})$/;
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" });

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const buildMonthLabel = (year, month) => {
  const date = new Date(Number(year), Number(month) - 1, 1);
  return Number.isNaN(date.getTime()) ? "" : monthFormatter.format(date);
};

// Accepts "2026-09", { year, month } or any plain label (used as-is).
export const toMonthLabel = (raw) => {
  if (raw && typeof raw === "object") return buildMonthLabel(raw.year, raw.month);
  const match = MONTH_KEY.exec(String(raw ?? ""));
  return match ? buildMonthLabel(match[1], match[2]) : String(raw ?? "");
};

const firstImage = (row) => row?.image ?? row?.images?.[0]?.url ?? null;

export const normalizeSales = (rows) =>
  toArray(rows).map((row) => ({
    month: toMonthLabel(row?.month ?? row?._id),
    total: toNumber(row?.total),
  }));

// Always returns every status (0 if missing) in a fixed order.
export const normalizeOrdersByStatus = (rows) => {
  const counts = {};
  for (const row of toArray(rows)) {
    const status = row?.status ?? row?._id;
    if (ORDER_STATUSES.includes(status)) counts[status] = toNumber(row?.count);
  }
  return ORDER_STATUSES.map((status) => ({ status, count: counts[status] ?? 0 }));
};

export const normalizeTopProducts = (rows) =>
  toArray(rows).map((row, index) => ({
    id: String(row?._id ?? row?.product ?? index),
    title: row?.title ?? "Untitled product",
    image: firstImage(row),
    sold: toNumber(row?.sold ?? row?.totalSold ?? row?.qty),
  }));

export const normalizeLowStock = (rows) =>
  toArray(rows).map((row, index) => ({
    id: String(row?._id ?? index),
    title: row?.title ?? "Untitled product",
    image: firstImage(row),
    stock: toNumber(row?.totalStock),
  }));

const getCustomerName = (user) =>
  user && typeof user === "object" ? user.name || user.email || "" : "";

export const normalizeRecentOrders = (rows) =>
  toArray(rows).map((row, index) => {
    const id = String(row?._id ?? index);
    return {
      id,
      number: getShortOrderId(id),
      customer: getCustomerName(row?.user),
      total: toNumber(row?.totalPrice),
      status: row?.status ?? "",
      createdAt: row?.createdAt ?? null,
    };
  });

export const normalizeStats = (data) => {
  const stats = data ?? {};
  return {
    totalSales: toNumber(stats.totalSales),
    ordersCount: toNumber(stats.ordersCount),
    usersCount: toNumber(stats.usersCount),
    productsCount: toNumber(stats.productsCount),
    pendingOrders: toNumber(stats.pendingOrders),
    salesByMonth: normalizeSales(stats.salesByMonth),
    ordersByStatus: normalizeOrdersByStatus(stats.ordersByStatus),
    topProducts: normalizeTopProducts(stats.topProducts),
    lowStockProducts: normalizeLowStock(stats.lowStockProducts),
    recentOrders: normalizeRecentOrders(stats.recentOrders),
  };
};