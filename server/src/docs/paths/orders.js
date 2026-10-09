import { op, ok, json, ref, pathParam, queryParam } from "../helpers.js";
import { examples as ex } from "../schemas.js";

const ORDERS = "Orders";
const PAY = "Payments";

const obj = (properties, required) => ({ type: "object", properties, ...(required && { required }) });
const orderId = pathParam("id", "Order _id");

export default {
  "/orders": {
    post: op({
      tag: ORDERS, summary: "Place an order (stock is reserved atomically; prices are recalculated on the server)",
      auth: "protect", status: 201,
      body: json(
        obj(
          {
            items: { type: "array", items: ref("CartItem") },
            shippingAddress: ref("ShippingAddress"),
            paymentMethod: { type: "string", enum: ["cod", "stripe"] },
            couponCode: { type: "string" },
          },
          ["items", "shippingAddress", "paymentMethod"]
        ),
        { items: [{ productId: "665f1c2e8b3a4c0012a4d111", size: "M", color: "white", qty: 2 }], shippingAddress: ex.shippingAddress, paymentMethod: "cod", couponCode: "SUMMER20" }
      ),
      response: ok("Created", { order: ex.order }), errors: [400, 404, 429],
    }),
  },
  "/orders/my": {
    get: op({
      tag: ORDERS, summary: "My orders, newest first (10 per page)", auth: "protect",
      params: [queryParam("page", "Page number", { type: "integer", minimum: 1 })],
      response: ok("OK", { orders: [ex.order], pages: 1 }),
    }),
  },
  "/orders/{id}": {
    get: op({
      tag: ORDERS, summary: "One order (owner or admin)", auth: "protect", params: [orderId],
      response: ok("OK", { order: ex.order }), errors: [403, 404],
    }),
  },
  "/orders/{id}/cancel": {
    patch: op({
      tag: ORDERS, summary: "Cancel my pending order (stock and coupon use are restored once)", auth: "protect", params: [orderId],
      response: ok("Cancelled", { order: { ...ex.order, status: "cancelled" } }), errors: [400, 403, 404],
    }),
  },

  "/payments/intent": {
    post: op({
      tag: PAY, summary: "Create (or reuse) the Stripe PaymentIntent of my unpaid Stripe order", auth: "protect",
      body: json(obj({ orderId: { type: "string" } }, ["orderId"]), { orderId: "665f1c2e8b3a4c0012a4d111" }),
      response: ok("Created", { clientSecret: "pi_3Nxxx_secret_xxx" }), errors: [400, 403, 404, 502],
    }),
  },
  "/payments/webhook": {
    post: op({
      tag: PAY, summary: "Stripe webhook (called by Stripe only, verified by signature)",
      params: [{ name: "stripe-signature", in: "header", required: true, schema: { type: "string" } }],
      body: json({ type: "object", description: "Raw Stripe event, must not be re-serialized" }),
      response: ok("Event processed or ignored", { received: true }), errors: [400],
    }),
  },
};