import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import * as pricingService from "../src/services/pricingService.js";
import { createProduct, createCoupon, shippingPrice } from "./helpers.js";

let discounted;
let plain;

beforeEach(async () => {
  discounted = await createProduct({ title: "Discounted Tee", price: 100, discountPrice: 80 });
  plain = await createProduct({
    title: "Plain Socks",
    price: 50,
    variants: [{ size: "L", color: "blue", stock: 2 }],
  });
});

// Subtotal: 80 * 2 (discountPrice is used) + 50 * 1 = 210
const cart = () => [
  { productId: String(discounted._id), size: "M", color: "white", qty: 2 },
  { productId: String(plain._id), size: "L", color: "blue", qty: 1 },
];

describe("calculateOrderPricing", () => {
  it("uses discountPrice when present and adds the fixed shipping price", async () => {
    const pricing = await pricingService.calculateOrderPricing({ items: cart() });

    expect(pricing.lineItems).toHaveLength(2);
    expect(pricing.lineItems[0].price).toBe(80);
    expect(pricing.itemsPrice).toBe(210);
    expect(pricing.discountAmount).toBe(0);
    expect(pricing.totalPrice).toBeCloseTo(210 + shippingPrice(), 2);
  });

  it("applies a percent coupon to the items price (not to shipping)", async () => {
    await createCoupon({ code: "TEN", type: "percent", value: 10 });
    const pricing = await pricingService.calculateOrderPricing({ items: cart(), couponCode: "ten" });

    expect(pricing.couponCode).toBe("TEN");
    expect(pricing.discountAmount).toBe(21);
    expect(pricing.totalPrice).toBeCloseTo(189 + shippingPrice(), 2);
  });

  it("never lets a fixed coupon exceed the items price", async () => {
    await createCoupon({ code: "HUGE", type: "fixed", value: 500 });
    const pricing = await pricingService.calculateOrderPricing({ items: cart(), couponCode: "HUGE" });

    expect(pricing.discountAmount).toBe(210);
    expect(pricing.totalPrice).toBeCloseTo(shippingPrice(), 2);
  });

  it.each([
    ["below the minimum order", { code: "BIG", minOrder: 500 }, "BIG"],
    ["expired", { code: "OLD", expiresAt: new Date(Date.now() - 1000) }, "OLD"],
    ["inactive", { code: "OFF", isActive: false }, "OFF"],
    ["unknown", { code: "REAL" }, "NOPE"],
  ])("rejects a coupon that is %s with 400", async (_label, couponData, usedCode) => {
    await createCoupon(couponData);

    await expect(
      pricingService.calculateOrderPricing({ items: cart(), couponCode: usedCode })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects quantities above the stock, including when split over duplicate rows", async () => {
    const item = { productId: String(discounted._id), size: "M", color: "white" };

    await expect(
      pricingService.calculateOrderPricing({ items: [{ ...item, qty: 6 }] })
    ).rejects.toMatchObject({ statusCode: 400 });

    // 3 + 3 = 6 > 5: rows must be merged before the stock check
    await expect(
      pricingService.calculateOrderPricing({ items: [{ ...item, qty: 3 }, { ...item, qty: 3 }] })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects inactive products (400) and unknown products (404)", async () => {
    const inactive = await createProduct({ title: "Hidden Hat", isActive: false });
    const base = { size: "M", color: "white", qty: 1 };

    await expect(
      pricingService.calculateOrderPricing({ items: [{ ...base, productId: String(inactive._id) }] })
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      pricingService.calculateOrderPricing({
        items: [{ ...base, productId: new mongoose.Types.ObjectId().toString() }],
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("POST /api/cart/preview", () => {
  it("is public and ignores any price sent by the client", async () => {
    const res = await request(app)
      .post("/api/cart/preview")
      .send({ items: [{ productId: String(discounted._id), size: "M", color: "white", qty: 1, price: 1 }] });

    expect(res.status).toBe(200);
    expect(res.body.data.pricing.itemsPrice).toBe(80);
    expect(res.body.data.pricing.lineItems[0].price).toBe(80);
  });

  it("returns 400 for an empty cart", async () => {
    const res = await request(app).post("/api/cart/preview").send({ items: [] });
    expect(res.status).toBe(400);
  });
});