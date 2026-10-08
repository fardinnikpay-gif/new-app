import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import { createLoggedInUser } from "./helpers.js";

const someId = () => new mongoose.Types.ObjectId().toString();

const adminRoutes = [
  ["get", "/api/admin/stats"],
  ["get", "/api/admin/users"],
  ["get", `/api/admin/users/${someId()}`],
  ["delete", `/api/admin/users/${someId()}`],
  ["get", "/api/admin/orders"],
  ["patch", `/api/admin/orders/${someId()}/status`],
  ["patch", `/api/admin/orders/${someId()}/paid`],
  ["post", "/api/products"],
  ["put", `/api/products/${someId()}`],
  ["delete", `/api/products/${someId()}`],
  ["patch", `/api/products/${someId()}/toggle-active`],
  ["get", "/api/coupons"],
  ["post", "/api/coupons"],
  ["put", `/api/coupons/${someId()}`],
  ["delete", `/api/coupons/${someId()}`],
  ["post", `/api/coupons/${someId()}/send`],
  ["put", `/api/categories/${someId()}`],
];

describe("admin-only routes", () => {
  it.each(adminRoutes)("%s %s returns 403 for a normal user", async (method, path) => {
    const { agent } = await createLoggedInUser(app);
    const res = await agent[method](path);
    expect(res.status).toBe(403);
  });

  it.each(adminRoutes)("%s %s returns 401 without a login", async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
  });
});

describe("admin access", () => {
  it("lets an admin open the dashboard and the user list", async () => {
    const { agent } = await createLoggedInUser(app, { role: "admin" });

    expect((await agent.get("/api/admin/stats")).status).toBe(200);
    expect((await agent.get("/api/admin/users")).status).toBe(200);
  });

  it("does not let an admin delete their own account", async () => {
    const { user, agent } = await createLoggedInUser(app, { role: "admin" });
    const res = await agent.delete(`/api/admin/users/${user._id}`);
    expect(res.status).toBe(400);
  });
});