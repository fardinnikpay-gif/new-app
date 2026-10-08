import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination } from "../utils/pagination.js";

const CUSTOMER_PAGE_SIZE = 10;
const ADMIN_PAGE_SIZE = 20;
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const asString = (value) => (typeof value === "string" ? value.trim() : undefined);
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Query params can be arrays/objects (?page[]=1), so only strings are passed on
const paginate = (query, limit) => getPagination({ page: asString(query.page), limit });

// Customers never need the Stripe intent id
export const toCustomerView = (order) => {
  const plain = typeof order.toObject === "function" ? order.toObject() : { ...order };
  delete plain.paymentIntentId;
  return plain;
};

const buildAdminFilter = (query) => {
  const filter = {};

  const status = asString(query.status);
  if (status) {
    if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, "Invalid status filter");
    filter.status = status;
  }

  const search = asString(query.search);
  if (search) {
    // Escaped + length-limited, so user input can never become a regex pattern
    const pattern = new RegExp(escapeRegex(search.slice(0, 60)), "i");
    filter.$or = [
      { "shippingAddress.fullName": pattern },
      { "shippingAddress.phone": pattern },
      ...(OBJECT_ID_RE.test(search) ? [{ _id: search }] : []),
    ];
  }
  return filter;
};

export const getMyOrders = async (userId, query) => {
  const { limit, skip } = paginate(query, CUSTOMER_PAGE_SIZE);
  const filter = { user: userId };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select("-paymentIntentId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);
  return { orders, pages: Math.ceil(total / limit) };
};

export const getOrderById = async (orderId, viewer) => {
  const isAdmin = viewer.role === "admin";

  const dbQuery = Order.findById(orderId);
  if (isAdmin) dbQuery.populate("user", "name email phone");
  else dbQuery.select("-paymentIntentId");

  const order = await dbQuery.lean();
  if (!order) throw new ApiError(404, "Order not found");
  if (!isAdmin && String(order.user) !== String(viewer._id)) {
    throw new ApiError(403, "You do not have access to this order");
  }
  return order;
};

export const getAllOrders = async (query) => {
  const { limit, skip } = paginate(query, ADMIN_PAGE_SIZE);
  const filter = buildAdminFilter(query);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);
  return { orders, total, pages: Math.ceil(total / limit) };
};