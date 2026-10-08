import Product from "../models/Product.js";
import {config} from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import * as couponService from "./couponService.js";

const round2 = (n) => Math.round(n * 100) / 100;

const describe = (title, item) => `"${title}" (size ${item.size}, color ${item.color})`;

// Same product + size + color in two rows must be one row, otherwise the stock check can be bypassed
const mergeDuplicateItems = (items) => {
  const merged = new Map();
  for (const item of items) {
    const key = `${item.productId}|${item.size}|${item.color}`;
    const existing = merged.get(key);
    if (existing) existing.qty += item.qty;
    else merged.set(key, { ...item });
  }
  return [...merged.values()];
};

// One query for all products instead of one per cart row
const loadProducts = async (items) => {
  const ids = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: ids } })
    .select("title images price discountPrice variants isActive")
    .lean();
  return new Map(products.map((product) => [String(product._id), product]));
};

const buildLineItem = (item, product) => {
  if (!product) throw new ApiError(404, "Product not found");
  if (!product.isActive) {
    throw new ApiError(400, `"${product.title}" is no longer available`);
  }

  const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
  if (!variant) {
    throw new ApiError(400, `${describe(product.title, item)} is not available`);
  }
  if (variant.stock < item.qty) {
    throw new ApiError(400, `Not enough stock for ${describe(product.title, item)}`);
  }

  // Price always comes from the database: discountPrice if present, otherwise price
  const price = product.discountPrice ?? product.price;
  return {
    product: product._id,
    title: product.title,
    image: product.images?.[0]?.url ?? "",
    size: item.size,
    color: item.color,
    qty: item.qty,
    price,
    lineTotal: round2(price * item.qty),
  };
};

const applyCoupon = async (couponCode, itemsPrice) => {
  if (!couponCode) return { discountAmount: 0, couponCode: null };
  try {
    const coupon = await couponService.getValidCoupon(couponCode, itemsPrice);
    return {
      discountAmount: couponService.calculateDiscount(coupon, itemsPrice),
      couponCode: coupon.code,
    };
  } catch (error) {
    // Unknown code is a 400 here (step 17 returns 404 for the standalone validate endpoint)
    if (error.statusCode === 404) throw new ApiError(400, "Invalid coupon code");
    throw error;
  }
};

export const calculateOrderPricing = async ({ items, couponCode }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const mergedItems = mergeDuplicateItems(items);
  const productMap = await loadProducts(mergedItems);
  const lineItems = mergedItems.map((item) =>
    buildLineItem(item, productMap.get(item.productId))
  );

  const itemsPrice = round2(lineItems.reduce((sum, line) => sum + line.lineTotal, 0));
  const applied = await applyCoupon(couponCode, itemsPrice);
  const shippingPrice = round2(Number(config.shippingPrice));
  const totalPrice = round2(Math.max(0, itemsPrice - applied.discountAmount) + shippingPrice);

  return {
    lineItems,
    itemsPrice,
    discountAmount: applied.discountAmount,
    shippingPrice,
    totalPrice,
    couponCode: applied.couponCode,
  };
};