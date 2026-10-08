import request from "supertest";
import app from "../src/app.js";
import { createProduct } from "./helpers.js";

const titles = (res) => res.body.data.products.map((product) => product.title);

beforeEach(async () => {
  await createProduct({ title: "Alpha Shirt", brand: "Nike", price: 100, isFeatured: true });
  await createProduct({
    title: "Beta Jeans",
    brand: "Levis",
    price: 60,
    variants: [{ size: "L", color: "blue", stock: 5 }],
  });
  await createProduct({ title: "Gamma Dress", brand: "Zara", price: 80, categoryName: "women" });
  await createProduct({ title: "Delta Coat", brand: "Nike", price: 200, isActive: false });
  await createProduct({
    title: "Echo Hat",
    brand: "Nike",
    price: 20,
    variants: [
      { size: "S", color: "white", stock: 0 },
      { size: "M", color: "white", stock: 3 },
    ],
  });
});

describe("GET /api/products", () => {
  it("returns only active products with pagination info", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(titles(res).sort()).toEqual(["Alpha Shirt", "Beta Jeans", "Echo Hat", "Gamma Dress"]);
    expect(res.body.data).toMatchObject({ total: 4, pages: 1, page: 1 });
  });

  it("filters by brand", async () => {
    const res = await request(app).get("/api/products?brand=Nike");
    expect(titles(res).sort()).toEqual(["Alpha Shirt", "Echo Hat"]); // Delta Coat is inactive
  });

  it("filters by price range", async () => {
    const res = await request(app).get("/api/products?minPrice=50&maxPrice=90");
    expect(titles(res).sort()).toEqual(["Beta Jeans", "Gamma Dress"]);
  });

  it("sorts by price ascending and descending", async () => {
    const asc = await request(app).get("/api/products?sort=price_asc");
    const desc = await request(app).get("/api/products?sort=price_desc");

    expect(titles(asc)).toEqual(["Echo Hat", "Beta Jeans", "Gamma Dress", "Alpha Shirt"]);
    expect(titles(desc)).toEqual(["Alpha Shirt", "Gamma Dress", "Beta Jeans", "Echo Hat"]);
  });

  it("ignores variants without stock when filtering by size", async () => {
    const outOfStock = await request(app).get("/api/products?size=S");
    const inStock = await request(app).get("/api/products?size=M&color=white");

    expect(titles(outOfStock)).toEqual([]); // Echo Hat has size S, but with 0 stock
    expect(titles(inStock).sort()).toEqual(["Alpha Shirt", "Echo Hat", "Gamma Dress"]);
  });

  it("paginates", async () => {
    const res = await request(app).get("/api/products?sort=price_asc&limit=2&page=2");

    expect(titles(res)).toEqual(["Gamma Dress", "Alpha Shirt"]);
    expect(res.body.data).toMatchObject({ total: 4, pages: 2, page: 2 });
  });

  it("returns 400 for an invalid sort value", async () => {
    const res = await request(app).get("/api/products?sort=cheapest");
    expect(res.status).toBe(400);
  });

  it("searches by title", async () => {
    const res = await request(app).get("/api/products?search=Alpha");
    expect(titles(res)).toEqual(["Alpha Shirt"]);
  });
});

describe("single product routes", () => {
  it("serves /featured before /:slug", async () => {
    const res = await request(app).get("/api/products/featured");

    expect(res.status).toBe(200);
    expect(titles(res)).toContain("Alpha Shirt");
  });

  it("returns a product by slug and 404 for an unknown slug", async () => {
    const found = await request(app).get("/api/products/alpha-shirt");
    const missing = await request(app).get("/api/products/does-not-exist");

    expect(found.status).toBe(200);
    expect(found.body.data.product.title).toBe("Alpha Shirt");
    expect(missing.status).toBe(404);
  });
});