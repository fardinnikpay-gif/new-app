import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { schemas } from "./schemas.js";
import authPaths from "./paths/auth.js";
import catalogPaths from "./paths/catalog.js";
import shopPaths from "./paths/shop.js";
import orderPaths from "./paths/orders.js";
import adminPaths from "./paths/admin.js";

const TAGS = ["Auth", "Users", "Categories", "Products", "Wishlist", "Coupons", "Cart", "Orders", "Payments", "Admin", "Health"];

export const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Clothing Store API",
      version: "1.0.0",
      description:
        "REST API for the clothing store. Every response is { success, message, data }; errors are { success: false, message }. " +
        "Message texts in the examples are illustrative. Log in with POST /auth/login first: the httpOnly cookie is then sent automatically.",
    },
    servers: [{ url: "/api" }],
    tags: TAGS.map((name) => ({ name })),
    components: {
      // The cookie name must match setAuthCookie() in utils/token.js
      securitySchemes: { cookieAuth: { type: "apiKey", in: "cookie", name: "token" } },
      schemas,
    },
    paths: { ...authPaths, ...catalogPaths, ...shopPaths, ...orderPaths, ...adminPaths },
  },
  apis: [], // everything is defined in src/docs, nothing is read from JSDoc comments
});

// The docs list every admin endpoint, so they are off in production unless ENABLE_DOCS=true
export const setupSwagger = (app) => {
  const enabled = process.env.NODE_ENV !== "production" || process.env.ENABLE_DOCS === "true";
  if (!enabled) return;

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      customSiteTitle: "Clothing Store API",
      swaggerOptions: { persistAuthorization: true },
    })
  );
};