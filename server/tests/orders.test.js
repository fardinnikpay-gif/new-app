import request from "supertest";
import app from "../src/app.js";
import Order from "../src/models/Order.js";
import Coupon from "../src/models/Coupon.js";
import {
  createProduct,
  createCoupon,
  createLoggedInUser,
  orderPayload,
  getStock,
  shippingPrice,
} from "./helpers.js";

let product;
let customer;

beforeEach(async () => {
  product = await createProduct({ title: "Order Test Tee", price: 50 }); // stock: 5 (M, white)
  customer = await createLoggedInUser(app);
});

const usedCount = async (code) => (await Coupon.findOne({ code }).lean()).usedCount;

describe("POST /api/orders", () => {
  it("creates a COD order, reduces stock and ignores client-sent totals", async () => {
    const res = await customer.agent
      .post("/api/orders")
      .send(orderPayload(product, { qty: 2, totalPrice: 1, userId: "someone-else" }));

    expect(res.status).toBe(201);
    const { order } = res.body.data;
    expect(order.status).toBe("pending");
    expect(order.isPaid).toBe(false);
    expect(order.totalPrice).toBeCloseTo(100 + shippingPrice(), 2);
    expect(order.items[0]).toMatchObject({ title: "Order Test Tee", price: 50, qty: 2, size: "M", color: "white" });
    expect(String(order.user)).toBe(String(customer.user._id));
    expect(await getStock(product._id)).toBe(3);
  });

  it("returns 400 when stock is insufficient and changes nothing", async () => {
    const res = await customer.agent.post("/api/orders").send(orderPayload(product, { qty: 6 }));

    expect(res.status).toBe(400);
    expect(await getStock(product._id)).toBe(5);
    expect(await Order.countDocuments()).toBe(0);
  });

  it("never oversells when orders arrive at the same time", async () => {
    // stock 5, three simultaneous orders of 2: only two can fit (5 -> 3 -> 1)
    const responses = await Promise.all(
      [1, 2, 3].map(() => customer.agent.post("/api/orders").send(orderPayload(product, { qty: 2 })))
    );
    const statuses = responses.map((res) => res.status).sort();

    expect(statuses).toEqual([201, 201, 400]);
    expect(await getStock(product._id)).toBe(1);
    expect(await Order.countDocuments()).toBe(2);
  });

  it("consumes a coupon use once and rejects it when the limit is reached", async () => {
    await createCoupon({ code: "ONCE", type: "fixed", value: 5, maxUses: 1 });

    const first = await customer.agent.post("/api/orders").send(orderPayload(product, { couponCode: "ONCE" }));
    const second = await customer.agent.post("/api/orders").send(orderPayload(product, { couponCode: "ONCE" }));

    expect(first.status).toBe(201);
    expect(first.body.data.order.discountAmount).toBe(5);
    expect(second.status).toBe(400);
    expect(await usedCount("ONCE")).toBe(1);
    expect(await getStock(product._id)).toBe(4); // only the first order took stock
  });

  it("returns 401 without a login", async () => {
    const res = await request(app).post("/api/orders").send(orderPayload(product));
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/orders/:id/cancel", () => {
  it("restores stock and the coupon use, and cannot be repeated", async () => {
    await createCoupon({ code: "BACK", type: "fixed", value: 5, maxUses: 5 });
    const created = await customer.agent
      .post("/api/orders")
      .send(orderPayload(product, { qty: 2, couponCode: "BACK" }));
    const orderId = created.body.data.order._id;
    expect(await getStock(product._id)).toBe(3);
    expect(await usedCount("BACK")).toBe(1);

    const cancel = await customer.agent.patch(`/api/orders/${orderId}/cancel`);
    expect(cancel.status).toBe(200);
    expect(cancel.body.data.order.status).toBe("cancelled");
    expect(await getStock(product._id)).toBe(5);
    expect(await usedCount("BACK")).toBe(0);

    const again = await customer.agent.patch(`/api/orders/${orderId}/cancel`);
    expect(again.status).toBe(400);
    expect(await getStock(product._id)).toBe(5); // no double restore
  });
});

describe("order access", () => {
  it("lets only the owner or an admin read or cancel an order", async () => {
    const created = await customer.agent.post("/api/orders").send(orderPayload(product));
    const orderId = created.body.data.order._id;
    const stranger = await createLoggedInUser(app);
    const admin = await createLoggedInUser(app, { role: "admin" });

    expect((await customer.agent.get(`/api/orders/${orderId}`)).status).toBe(200);
    expect((await admin.agent.get(`/api/orders/${orderId}`)).status).toBe(200);
    expect((await stranger.agent.get(`/api/orders/${orderId}`)).status).toBe(403);
    expect((await stranger.agent.patch(`/api/orders/${orderId}/cancel`)).status).toBe(403);
    expect(await getStock(product._id)).toBe(4); // the stranger's cancel changed nothing
  });

  it("lists only my own orders on /orders/my", async () => {
    await customer.agent.post("/api/orders").send(orderPayload(product));
    const stranger = await createLoggedInUser(app);

    const mine = await customer.agent.get("/api/orders/my");
    const theirs = await stranger.agent.get("/api/orders/my");

    expect(mine.status).toBe(200);
    expect(mine.body.data.orders).toHaveLength(1);
    expect(theirs.body.data.orders).toHaveLength(0);
  });
});