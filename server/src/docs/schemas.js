import { ref } from "./helpers.js";

const ID = "665f1c2e8b3a4c0012a4d111";
const DATE = "2026-10-01T10:00:00.000Z";

const str = (example, extra = {}) => ({ type: "string", example, ...extra });
const num = (example) => ({ type: "number", example });
const int = (example) => ({ type: "integer", example });
const bool = (example) => ({ type: "boolean", example });
const date = { type: "string", format: "date-time", example: DATE };
const arr = (items) => ({ type: "array", items });
const obj = (properties, example, extra = {}) => ({ type: "object", properties, example, ...extra });

const addressFields = {
  fullName: str("Ali Rezaei"),
  phone: str("+491512345678"),
  city: str("Frankfurt"),
  street: str("Main Street 12"),
  postalCode: str("60311"),
};
const shippingAddress = Object.fromEntries(Object.entries(addressFields).map(([k, v]) => [k, v.example]));
const lineItem = {
  product: ID, title: "Classic Oxford Shirt", image: "https://res.cloudinary.com/demo/shirt.jpg",
  size: "M", color: "white", qty: 2, price: 49.9,
};

// Reused as response examples in the path files
export const examples = {
  user: { _id: ID, name: "Ali Rezaei", email: "ali@example.com", phone: "+491512345678", role: "user", addresses: [], createdAt: DATE },
  address: { _id: ID, ...shippingAddress, isDefault: true },
  shippingAddress,
  product: {
    _id: ID, title: "Classic Oxford Shirt", slug: "classic-oxford-shirt", brand: "Northwind",
    description: "Slim fit cotton oxford shirt", category: { _id: ID, name: "men", slug: "men" },
    price: 59.9, discountPrice: 49.9,
    images: [{ url: "https://res.cloudinary.com/demo/shirt.jpg", publicId: "clothing-store/products/shirt" }],
    variants: [{ size: "M", color: "white", stock: 10 }], isActive: true, isFeatured: true, createdAt: DATE,
  },
  coupon: { _id: ID, code: "SUMMER20", type: "percent", value: 20, minOrder: 50, maxUses: 100, usedCount: 3, expiresAt: DATE, isActive: true },
  publicCoupon: { code: "SUMMER20", type: "percent", value: 20, minOrder: 50, expiresAt: DATE },
  pricing: {
    lineItems: [{ ...lineItem, lineTotal: 99.8 }],
    itemsPrice: 99.8, discountAmount: 19.96, shippingPrice: 5, totalPrice: 84.84, couponCode: "SUMMER20",
  },
  order: {
    _id: ID, user: ID, items: [lineItem], shippingAddress,
    itemsPrice: 99.8, discountAmount: 19.96, shippingPrice: 5, totalPrice: 84.84, couponCode: "SUMMER20",
    paymentMethod: "cod", isPaid: false, status: "pending", createdAt: DATE,
  },
};

export const schemas = {
  Error: obj(
    {
      success: bool(false),
      message: str("Category not found"),
      errors: { ...arr({ type: "object" }), description: "Field errors, only on validation failures (400)" },
    },
    { success: false, message: "Category not found" }
  ),
  User: obj(
    {
      _id: str(ID), name: str("Ali Rezaei"), email: str("ali@example.com"), phone: str("+491512345678"),
      role: { type: "string", enum: ["user", "admin"] }, addresses: arr(ref("Address")), createdAt: date,
    },
    examples.user
  ),
  Address: obj(
    { _id: str(ID), ...addressFields, isDefault: bool(true) },
    examples.address,
    { required: Object.keys(addressFields) }
  ),
  ShippingAddress: obj(addressFields, shippingAddress, { required: Object.keys(addressFields) }),
  Product: obj(
    {
      _id: str(ID), title: str("Classic Oxford Shirt"), slug: str("classic-oxford-shirt"), brand: str("Northwind"),
      description: str("Slim fit cotton oxford shirt"), category: { type: "object" }, price: num(59.9),
      discountPrice: num(49.9),
      images: arr(obj({ url: str("https://..."), publicId: str("clothing-store/products/shirt") })),
      variants: arr(obj({ size: str("M"), color: str("white"), stock: int(10) })),
      isActive: bool(true), isFeatured: bool(false), createdAt: date,
    },
    examples.product
  ),
  ProductForm: obj(
    {
      title: str("Classic Oxford Shirt"), description: str("Slim fit cotton oxford shirt"), brand: str("Northwind"),
      category: str(ID, { description: "Category _id from GET /categories" }), price: num(59.9),
      discountPrice: str("49.9", { description: "Must be lower than price. Send an empty value to remove it (update)" }),
      variants: str('[{"size":"M","color":"white","stock":10}]', { description: "JSON string, unique size+color pairs" }),
      isActive: str("true"), isFeatured: str("false"),
      images: { ...arr({ type: "string", format: "binary" }), description: "jpg/png/webp, max 2MB each, max 6 per product" },
      removedImages: str('["clothing-store/products/old"]', { description: "Update only: JSON array of publicIds to delete" }),
    },
    undefined,
    { required: ["title", "description", "brand", "category", "price", "variants"] }
  ),
  CartItem: obj(
    { productId: str(ID), size: str("M"), color: str("white"), qty: int(2) },
    { productId: ID, size: "M", color: "white", qty: 2 },
    { required: ["productId", "size", "color", "qty"] }
  ),
  Pricing: obj({ itemsPrice: num(99.8), discountAmount: num(19.96), shippingPrice: num(5), totalPrice: num(84.84) }, examples.pricing),
  Order: obj(
    {
      _id: str(ID), user: str(ID), items: arr({ type: "object" }), shippingAddress: ref("ShippingAddress"),
      itemsPrice: num(99.8), discountAmount: num(19.96), shippingPrice: num(5), totalPrice: num(84.84),
      couponCode: str("SUMMER20"), paymentMethod: { type: "string", enum: ["cod", "stripe"] },
      isPaid: bool(false), paidAt: date, status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
      createdAt: date,
    },
    examples.order
  ),
  CouponInput: obj(
    {
      code: str("SUMMER20"), type: { type: "string", enum: ["percent", "fixed"] }, value: num(20),
      minOrder: num(50), maxUses: { type: "integer", nullable: true, example: 100 }, expiresAt: date, isActive: bool(true),
    },
    { code: "SUMMER20", type: "percent", value: 20, minOrder: 50, maxUses: 100, expiresAt: DATE },
    { required: ["code", "type", "value", "expiresAt"] }
  ),
};