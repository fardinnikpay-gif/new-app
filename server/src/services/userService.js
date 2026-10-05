import User, { MAX_ADDRESSES } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const loadUser = async (userId, { withPassword = false } = {}) => {
  const user = await (withPassword ? User.findById(userId).select("+password") : User.findById(userId));
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

/** Duplicate phone surfaces as Mongo error 11000, which errorHandler turns into 409. */
export const updateProfile = async (userId, { name, phone }) => {
  const user = await loadUser(userId);
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  return user.toJSON();
};

/** Saving hashes the new password and sets passwordChangedAt (old tokens stop working). */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await loadUser(userId, { withPassword: true });
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
};

// Rule: a user with addresses always has exactly one default.
// preferredId is the address that was just made default (if any).
const ensureSingleDefault = (user, preferredId) => {
  const list = user.addresses;
  if (list.length === 0) return;

  const defaultId = preferredId ?? list.find((a) => a.isDefault)?.id ?? list[0].id;
  list.forEach((address) => {
    address.isDefault = address.id === defaultId;
  });
};

const findAddressOrThrow = (user, addressId) => {
  const address = user.addresses.id(addressId);
  if (!address) throw new ApiError(404, "Address not found");
  return address;
};

export const addAddress = async (userId, data) => {
  const user = await loadUser(userId);
  if (user.addresses.length >= MAX_ADDRESSES) {
    throw new ApiError(400, `You can save at most ${MAX_ADDRESSES} addresses`);
  }

  user.addresses.push({ ...data, isDefault: false });
  const added = user.addresses[user.addresses.length - 1];
  ensureSingleDefault(user, data.isDefault ? added.id : undefined);

  await user.save();
  return user.addresses;
};

export const updateAddress = async (userId, addressId, data) => {
  const user = await loadUser(userId);
  const address = findAddressOrThrow(user, addressId);

  const { isDefault, ...fields } = data;
  if (isDefault === false && address.isDefault) {
    throw new ApiError(400, "An address must stay default: set another address as default instead");
  }

  address.set(fields);
  ensureSingleDefault(user, isDefault ? address.id : undefined);

  await user.save();
  return user.addresses;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await loadUser(userId);
  findAddressOrThrow(user, addressId);

  user.addresses.pull({ _id: addressId });
  ensureSingleDefault(user); // if the default was deleted, the first remaining becomes default

  await user.save();
  return user.addresses;
};