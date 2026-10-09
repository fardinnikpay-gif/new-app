import { op, ok, json, multipart, ref, pathParam, queryParam } from "../helpers.js";
import { examples as ex } from "../schemas.js";

const CAT = "Categories";
const PROD = "Products";

const listParams = [
  queryParam("page", "Page number (default 1)", { type: "integer", minimum: 1 }),
  queryParam("limit", "Items per page (max 50)", { type: "integer", maximum: 50 }),
  queryParam("category", "Category filter"),
  queryParam("brand", "Brand name"),
  queryParam("size", "Size that is in stock, e.g. M"),
  queryParam("color", "Color that is in stock, e.g. white"),
  queryParam("minPrice", "Minimum price", { type: "number" }),
  queryParam("maxPrice", "Maximum price", { type: "number" }),
  queryParam("sort", "Sort order", { type: "string", enum: ["newest", "price_asc", "price_desc"] }),
  queryParam("search", "Text search in title, brand and description"),
];

const simpleList = (summary) =>
  op({ tag: PROD, summary, response: ok("OK", { products: [ex.product] }) });

const slugParam = pathParam("idOrSlug", "Product slug");
const idParam = pathParam("idOrSlug", "Product _id (ObjectId)");

export default {
  "/categories": {
    get: op({
      tag: CAT, summary: "List the 3 categories (men, women, kids)",
      response: ok("OK", { categories: [{ _id: "665f1c2e8b3a4c0012a4d111", name: "men", slug: "men", image: "https://..." }] }),
    }),
  },
  "/categories/{id}": {
    put: op({
      tag: CAT, summary: "Replace a category image", auth: "admin", params: [pathParam()],
      body: multipart({ type: "object", properties: { image: { type: "string", format: "binary" } }, required: ["image"] }),
      response: ok("Updated", { category: { name: "men", slug: "men", image: "https://..." } }), errors: [400, 404],
    }),
  },

  "/products": {
    get: op({
      tag: PROD, summary: "List active products (filter, sort, search, paginate)", params: listParams,
      response: ok("OK", { products: [ex.product], total: 30, pages: 3, page: 1 }), errors: [400],
    }),
    post: op({
      tag: PROD, summary: "Create a product (multipart, 1 to 6 images)", auth: "admin", status: 201,
      body: multipart(ref("ProductForm")), response: ok("Created", { product: ex.product }), errors: [400, 409],
    }),
  },
  "/products/featured": { get: simpleList("Featured products") },
  "/products/new-arrivals": { get: simpleList("Newest products") },
  "/products/brands": {
    get: op({ tag: PROD, summary: "Distinct brand names", response: ok("OK", { brands: ["Northwind", "Kestrel"] }) }),
  },
  "/products/{idOrSlug}": {
    get: op({
      tag: PROD, summary: "Product by slug", params: [slugParam],
      response: ok("OK", { product: ex.product }), errors: [404],
    }),
    put: op({
      tag: PROD, summary: "Update a product (only sent fields change; slug stays stable)", auth: "admin", params: [idParam],
      body: multipart(ref("ProductForm")), response: ok("Updated", { product: ex.product }), errors: [400, 404],
    }),
    delete: op({
      tag: PROD, summary: "Delete a product, its Cloudinary images and wishlist entries", auth: "admin", params: [idParam],
      response: ok("Deleted"), errors: [404],
    }),
  },
  "/products/{slug}/related": {
    get: op({
      tag: PROD, summary: "Up to 8 products from the same category", params: [pathParam("slug", "Product slug")],
      response: ok("OK", { products: [ex.product] }), errors: [404],
    }),
  },
  "/products/{id}/toggle-active": {
    patch: op({
      tag: PROD, summary: "Show or hide a product", auth: "admin", params: [pathParam()],
      response: ok("Updated", { product: ex.product }), errors: [404],
    }),
  },
};