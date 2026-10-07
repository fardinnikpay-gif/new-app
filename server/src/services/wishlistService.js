import User from "../models/User.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

export const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    match: { isActive: true },
  });
  if (!user) throw new ApiError(404, "User not found");
  // populate with match removes non-matching items; filter(Boolean) is a safety net for dangling ids
  return user.wishlist.filter(Boolean);
};

export const toggleWishlist = async (userId, productId) => {
  // Step 1: try to remove (always allowed, even if the product is now inactive)
  const removal = await User.updateOne(
    { _id: userId, wishlist: productId },
    { $pull: { wishlist: productId } }
  );
  if (removal.modifiedCount === 1) return { added: false };

  // Step 2: not in the list, so add it (only if the product exists and is active)
  const exists = await Product.exists({ _id: productId, isActive: true });
  if (!exists) throw new ApiError(404, "Product not found");

  await User.updateOne({ _id: userId }, { $addToSet: { wishlist: productId } });
  return { added: true };
};

export const clearWishlist = async (userId) => {
  await User.updateOne({ _id: userId }, { $set: { wishlist: [] } });
};