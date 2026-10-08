import request from "supertest";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import Coupon from "../src/models/Coupon.js";
import { makeSlug } from "../src/utils/slugify.js";

export const PASSWORD = "Passw0rd!123"; // test-only value

let counter = 0;
const nextId = () => (counter += 1);

export const shippingPrice = () => Number(process.env.SHIPPING_PRICE);

export const shippingAddress = {
  fullName: "Test Customer",
  phone: "+491512345678",
  city: "Frankfurt",
  street: "Main Street 12",
  postalCode: "60311",
};

export const createUser = (overrides = {}) =>
  User.create({ name: "Test User", email: `user${nextId()}@test.com`, password: PASSWORD, ...overrides });

export const loginAgent = async (app, user) => {
  const agent = request.agent(app); // keeps the auth cookie between requests
  const res = await agent.post("/api/auth/login").send({ identifier: user.email, password: PASSWORD });
  if (res.status !== 200) {
    throw new Error(`Test login failed (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return agent;
};

export const createLoggedInUser = async (app, overrides = {}) => {
  const user = await createUser(overrides);
  return { user, agent: await loginAgent(app, user) };
};

const createCategory = (name) =>
  Category.findOneAndUpdate({ name }, { $setOnInsert: { slug: name } }, { upsert: true, new: true });

export const createProduct = async ({ categoryName = "men", ...overrides } = {}) => {
  const title = overrides.title ?? `Test Product ${nextId()}`;
  const category = await createCategory(categoryName);
  return Product.create({
    title,
    slug: makeSlug(title),
    description: "A product used only in automated tests",
    brand: "TestBrand",
    category: category._id,
    price: 50,
    images: [{ url: "https://example.com/test.jpg", publicId: "test/img" }],
    variants: [{ size: "M", color: "white", stock: 5 }],
    isActive: true,
    isFeatured: false,
    ...overrides,
  });
};

export const createCoupon = (overrides = {}) =>
  Coupon.create({
    code: `TEST${nextId()}`,
    type: "percent",
    value: 10,
    minOrder: 0,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ...overrides,
  });

export const orderPayload = (product, { qty = 1, size = "M", color = "white", ...extra } = {}) => ({
  items: [{ productId: String(product._id), size, color, qty }],
  shippingAddress,
  paymentMethod: "cod",
  ...extra,
});

export const getStock = async (productId, size = "M", color = "white") => {
  const product = await Product.findById(productId).lean();
  return product.variants.find((v) => v.size === size && v.color === color).stock;
};