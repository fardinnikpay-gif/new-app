import User from "../models/User.js";
import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination } from "../utils/pagination.js";
import { asString, escapeRegex } from "../utils/queryHelpers.js";

const PAGE_SIZE = 20;

// Whitelists on purpose: .lean() skips the model's toJSON, so nothing sensitive may be selected at all
const LIST_FIELDS = "name email phone role createdAt";
const DETAIL_FIELDS = "name email phone role addresses createdAt updatedAt";

const buildFilter = (query) => {
  const filter = { role: "user" }; // same population as usersCount in the dashboard

  const search = asString(query.search);
  if (search) {
    const pattern = new RegExp(escapeRegex(search.slice(0, 60)), "i");
    filter.$or = [{ name: pattern }, { email: pattern }, { phone: pattern }];
  }
  return filter;
};

export const getUsers = async (query) => {
  const { limit, skip } = getPagination({ page: asString(query.page), limit: PAGE_SIZE });
  const filter = buildFilter(query);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(LIST_FIELDS)
      .sort({ createdAt: -1, _id: -1 }) // _id makes the order stable across pages
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return { users, total, pages: Math.ceil(total / limit) };
};

export const getUserById = async (id) => {
  const [user, ordersCount] = await Promise.all([
    User.findById(id).select(DETAIL_FIELDS).lean(),
    Order.countDocuments({ user: id }),
  ]);
  if (!user) throw new ApiError(404, "User not found");
  return { user, ordersCount };
};

export const deleteUser = async (id, adminId) => {
  if (String(id) === String(adminId)) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  // role: "user" in the filter protects admin accounts even if the check above is bypassed.
  // Orders are NOT touched: they keep their own snapshot of items and address.
  const deleted = await User.findOneAndDelete({ _id: id, role: "user" });
  if (deleted) return;

  // Only on failure: find out why, to return the right error
  const exists = await User.exists({ _id: id });
  if (!exists) throw new ApiError(404, "User not found");
  throw new ApiError(400, "Admin accounts cannot be deleted");
};
