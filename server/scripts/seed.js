import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import Coupon from "../src/models/Coupon.js";
import Order from "../src/models/Order.js";
import { makeSlug } from "../src/utils/slugify.js";
import { CATEGORY_NAMES, buildProducts, buildCoupons } from "./seedData.js";

const args = process.argv.slice(2);
const isDestroy = args.includes("--destroy");
const isForced = args.includes("--force");

const assertSafeEnvironment = () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");
  if (process.env.NODE_ENV === "production" && !isForced) {
    throw new Error("Refusing to run in production. Add --force only if you really mean it.");
  }
};

const seedAdmin = async () => {
  const { ADMIN_NAME = "Store Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }
  if (ADMIN_PASSWORD.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

  // There is only ever one admin
  if (await User.exists({ role: "admin" })) return console.log("Admin: already exists, skipped");

  if (await User.exists({ email: ADMIN_EMAIL.toLowerCase() })) {
    throw new Error("A non-admin user already uses ADMIN_EMAIL. Not promoting automatically.");
  }
  // User.create runs the pre-save hook, so the password is hashed
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
  console.log(`Admin: created (${ADMIN_EMAIL})`);
};

const seedCategories = async () => {
  const ids = {};

  for (const name of CATEGORY_NAMES) {
    const category = await Category.findOneAndUpdate(
      { name },
      {
        $setOnInsert: {
          slug: makeSlug(name),
          image: {
            url: `https://picsum.photos/seed/category-${name}/600/400`,
            publicId: `category-${makeSlug(name)}`,
          },
        },
      },
      { upsert: true, new: true }
    );

    ids[name] = category._id;
  }

  console.log(`Categories: ${CATEGORY_NAMES.length} ready`);
  return ids;
};

// insertMany runs full schema validation, unlike bulk upserts
const insertMissing = async (Model, docs, key) => {
  const existing = await Model.find({ [key]: { $in: docs.map((d) => d[key]) } }).select(key).lean();
  const known = new Set(existing.map((doc) => doc[key]));
  const fresh = docs.filter((doc) => !known.has(doc[key]));
  if (fresh.length) await Model.insertMany(fresh);
  return fresh.length;
};

const seedData = async () => {
  await seedAdmin();
  const categoryIds = await seedCategories();
  const products = await insertMissing(Product, buildProducts(categoryIds), "slug");
  const coupons = await insertMissing(Coupon, buildCoupons(), "code");
  console.log(`Products: ${products} created | Coupons: ${coupons} created`);
};

const destroyData = async () => {
  for (const Model of [Order, Product, Coupon, Category, User]) {
    const { deletedCount } = await Model.deleteMany({});
    console.log(`${Model.modelName}: ${deletedCount} deleted`);
  }
  console.log("Note: images uploaded to Cloudinary are NOT deleted.");
};

const run = async () => {
  assertSafeEnvironment();
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to database "${mongoose.connection.name}"`);
  await (isDestroy ? destroyData() : seedData());
};

run()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());