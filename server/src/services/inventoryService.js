import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

// Conditional + atomic: succeeds only if enough stock exists at this exact moment
const decrement = (line) =>
  Product.updateOne(
    {
      _id: line.product,
      isActive: true,
      variants: {
        $elemMatch: { size: line.size, color: line.color, stock: { $gte: line.qty } },
      },
    },
    { $inc: { "variants.$.stock": -line.qty } }
  );

const increment = (line) =>
  Product.updateOne(
    { _id: line.product, variants: { $elemMatch: { size: line.size, color: line.color } } },
    { $inc: { "variants.$.stock": line.qty } }
  );

// Never throws: a failed rollback must not hide the original error. Failures are logged for manual fixing.
// Accepts both pricing lineItems and order.items (same fields: product, size, color, qty).
export const releaseStock = async (lines) => {
  const results = await Promise.allSettled(lines.map(increment));
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const { product, size, color, qty } = lines[i];
      console.error(
        `STOCK RESTORE FAILED product=${product} size=${size} color=${color} qty=${qty}:`,
        result.reason?.message
      );
    }
  });
};

// Sequential on purpose, so we know exactly which lines were reserved if one fails
export const reserveStock = async (lines) => {
  const reserved = [];
  try {
    for (const line of lines) {
      const result = await decrement(line);
      if (result.modifiedCount !== 1) {
        throw new ApiError(
          400,
          `Not enough stock for "${line.title}" (size ${line.size}, color ${line.color})`
        );
      }
      reserved.push(line);
    }
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }
};
