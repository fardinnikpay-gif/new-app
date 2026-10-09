import request from "supertest";
import app from "../src/app.js";
import { spec } from "../src/docs/swagger.js";

// Same list as the api_table; the docs must contain exactly these operations
const API_TABLE = [
  "POST /auth/register", "POST /auth/login", "POST /auth/logout", "GET /auth/me",
  "POST /auth/forgot-password", "PUT /auth/reset-password/{token}",
  "PUT /users/profile", "PUT /users/password", "POST /users/addresses",
  "PUT /users/addresses/{id}", "DELETE /users/addresses/{id}",
  "GET /categories", "PUT /categories/{id}",
  "GET /products", "GET /products/featured", "GET /products/new-arrivals", "GET /products/brands",
  "GET /products/{idOrSlug}", "GET /products/{slug}/related", "POST /products",
  "PUT /products/{idOrSlug}", "DELETE /products/{idOrSlug}", "PATCH /products/{id}/toggle-active",
  "GET /wishlist", "POST /wishlist/{productId}", "DELETE /wishlist",
  "POST /coupons/validate", "GET /coupons", "POST /coupons", "PUT /coupons/{id}",
  "DELETE /coupons/{id}", "POST /coupons/{id}/send",
  "POST /cart/preview",
  "POST /orders", "GET /orders/my", "GET /orders/{id}", "PATCH /orders/{id}/cancel",
  "POST /payments/intent", "POST /payments/webhook",
  "GET /admin/stats", "GET /admin/users", "GET /admin/users/{id}", "DELETE /admin/users/{id}",
  "GET /admin/orders", "PATCH /admin/orders/{id}/status", "PATCH /admin/orders/{id}/paid",
  "GET /health",
];

const clientOrigin = () => new URL(process.env.CLIENT_URL.split(",")[0].trim()).origin;
const badLogin = { identifier: "nobody@test.com", password: "WrongPassword1" };

describe("API documentation", () => {
  it("documents exactly the endpoints of the api_table", () => {
    const documented = Object.entries(spec.paths).flatMap(([path, methods]) =>
      Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`)
    );
    expect(documented.sort()).toEqual([...API_TABLE].sort());
  });

  it("serves Swagger UI on /api/docs (outside production)", async () => {
    const res = await request(app).get("/api/docs/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});

describe("origin guard and CORS", () => {
  it("blocks a state-changing request from an unknown origin", async () => {
    const res = await request(app).post("/api/auth/login").set("Origin", "https://evil.example").send(badLogin);
    expect(res.status).toBe(403);
  });

  it.each([
    ["the client origin", (req) => req.set("Origin", clientOrigin())],
    ["the API's own origin (Swagger UI)", (req) => req.set("Host", "api.test").set("Origin", "http://api.test")],
    ["no Origin header (curl, webhooks)", (req) => req],
  ])("lets %s through to normal validation and auth", async (_label, decorate) => {
    const res = await decorate(request(app).post("/api/auth/login")).send(badLogin);
    expect(res.status).toBe(401);
  });

  it("does not send CORS headers to an unknown origin", async () => {
    const res = await request(app).get("/api/health").set("Origin", "https://evil.example");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("allows credentials only for the client origin", async () => {
    const res = await request(app).get("/api/health").set("Origin", clientOrigin());
    expect(res.headers["access-control-allow-origin"]).toBe(clientOrigin());
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});

describe("security headers", () => {
  it("hides x-powered-by and sets helmet headers", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });
});