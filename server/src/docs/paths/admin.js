import { op, ok, json, pathParam, queryParam } from "../helpers.js";
import { examples as ex } from "../schemas.js";

const ADMIN = "Admin";
const page = queryParam("page", "Page number", { type: "integer", minimum: 1 });
const search = queryParam("search", "Search text (max 60 characters)");
const id = pathParam();

const statsExample = {
  totalSales: 1520.4, ordersCount: 18, usersCount: 12, productsCount: 30, pendingOrders: 3,
  lowStockProducts: [{ _id: "665f1c2e8b3a4c0012a4d111", title: "Fleece Zip Hoodie", slug: "fleece-zip-hoodie", totalStock: 2 }],
  salesByMonth: [{ month: "2026-10", sales: 320.5, orders: 4 }],
  topProducts: [{ product: "665f1c2e8b3a4c0012a4d111", title: "Classic Oxford Shirt", quantitySold: 9, revenue: 449.1 }],
  ordersByStatus: [{ status: "pending", count: 3 }],
  recentOrders: [{ _id: "665f1c2e8b3a4c0012a4d111", totalPrice: 84.84, status: "pending" }],
};

const listUser = { _id: "665f1c2e8b3a4c0012a4d111", name: "Ali Rezaei", email: "ali@example.com", role: "user" };

export default {
  "/admin/stats": {
    get: op({ tag: ADMIN, summary: "Dashboard statistics (cancelled and unpaid Stripe orders are not sales)", auth: "admin", response: ok("OK", { stats: statsExample }) }),
  },
  "/admin/users": {
    get: op({ tag: ADMIN, summary: "List customers (role user), 20 per page", auth: "admin", params: [page, search], response: ok("OK", { users: [listUser], total: 12, pages: 1 }) }),
  },
  "/admin/users/{id}": {
    get: op({ tag: ADMIN, summary: "Customer details", auth: "admin", params: [id], response: ok("OK", { user: listUser, ordersCount: 4 }), errors: [404] }),
    delete: op({ tag: ADMIN, summary: "Delete a customer (orders are kept; admin accounts cannot be deleted)", auth: "admin", params: [id], response: ok("Deleted"), errors: [400, 404] }),
  },
  "/admin/orders": {
    get: op({
      tag: ADMIN, summary: "All orders, 20 per page", auth: "admin",
      params: [queryParam("status", "Status filter", { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] }), page, search],
      response: ok("OK", { orders: [ex.order], total: 18, pages: 1 }), errors: [400],
    }),
  },
  "/admin/orders/{id}/status": {
    patch: op({
      tag: ADMIN, summary: "Change status: pending > processing > shipped > delivered, or cancel before shipping", auth: "admin", params: [id],
      body: json({ type: "object", required: ["status"], properties: { status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] } } }, { status: "processing" }),
      response: ok("Updated", { order: { ...ex.order, status: "processing" } }), errors: [400, 404, 409],
    }),
  },
  "/admin/orders/{id}/paid": {
    patch: op({ tag: ADMIN, summary: "Mark a cash-on-delivery order as paid", auth: "admin", params: [id], response: ok("Updated", { order: { ...ex.order, isPaid: true } }), errors: [400, 404] }),
  },
  "/health": {
    get: op({ tag: "Health", summary: "Liveness check", response: ok("Server is running") }),
  },
};