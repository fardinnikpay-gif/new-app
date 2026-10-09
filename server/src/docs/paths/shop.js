import { op, ok, json, ref, pathParam } from "../helpers.js";
import { examples as ex } from "../schemas.js";

const WISH = "Wishlist";
const COUPON = "Coupons";

const obj = (properties, required) => ({ type: "object", properties, ...(required && { required }) });

export default {
  "/wishlist": {
    get: op({ tag: WISH, summary: "My wishlist (active products only)", auth: "protect", response: ok("OK", { products: [ex.product] }) }),
    delete: op({ tag: WISH, summary: "Clear my wishlist", auth: "protect", response: ok("Cleared") }),
  },
  "/wishlist/{productId}": {
    post: op({
      tag: WISH, summary: "Toggle a product (add if missing, remove if present)", auth: "protect",
      params: [pathParam("productId", "Product _id")],
      response: ok("Toggled", { added: true }, "Added to wishlist"), errors: [400, 404],
    }),
  },

  "/coupons/validate": {
    post: op({
      tag: COUPON, summary: "Preview the discount of a coupon code", auth: "protect",
      body: json(obj({ code: { type: "string" }, subtotal: { type: "number" } }, ["code", "subtotal"]), { code: "SUMMER20", subtotal: 100 }),
      response: ok("Valid", { discountAmount: 20, coupon: ex.publicCoupon }), errors: [400, 404, 429],
    }),
  },
  "/coupons": {
    get: op({ tag: COUPON, summary: "List all coupons", auth: "admin", response: ok("OK", { coupons: [ex.coupon] }) }),
    post: op({
      tag: COUPON, summary: "Create a coupon (code is stored uppercase)", auth: "admin", status: 201,
      body: json(ref("CouponInput")), response: ok("Created", { coupon: ex.coupon }), errors: [400, 409],
    }),
  },
  "/coupons/{id}": {
    put: op({
      tag: COUPON, summary: "Update a coupon (usedCount cannot be changed)", auth: "admin", params: [pathParam()],
      body: json(ref("CouponInput")), response: ok("Updated", { coupon: ex.coupon }), errors: [400, 404, 409],
    }),
    delete: op({ tag: COUPON, summary: "Delete a coupon", auth: "admin", params: [pathParam()], response: ok("Deleted"), errors: [404] }),
  },
  "/coupons/{id}/send": {
    post: op({
      tag: COUPON, summary: "Email a coupon to up to 50 addresses", auth: "admin", params: [pathParam()],
      body: json(obj({ emails: { type: "array", maxItems: 50, items: { type: "string", format: "email" } } }, ["emails"]), { emails: ["a@example.com"] }),
      response: ok("Handed to the mail service", { sent: 1 }), errors: [400, 404],
    }),
  },

  "/cart/preview": {
    post: op({
      tag: "Cart", summary: "Price a cart on the server (prices and stock always come from the database)",
      body: json(obj({ items: { type: "array", items: ref("CartItem") }, couponCode: { type: "string" } }, ["items"]), {
        items: [{ productId: "665f1c2e8b3a4c0012a4d111", size: "M", color: "white", qty: 2 }],
        couponCode: "SUMMER20",
      }),
      response: ok("Priced", { pricing: ex.pricing }), errors: [400, 404, 429],
    }),
  },
};