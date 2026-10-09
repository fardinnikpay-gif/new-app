import { op, ok, json, ref, pathParam } from "../helpers.js";
import { examples as ex } from "../schemas.js";

const AUTH = "Auth";
const USERS = "Users";
const cookieNote = "An httpOnly auth cookie is set.";

const obj = (properties, required) => ({ type: "object", properties, ...(required && { required }) });
const text = { type: "string" };

export default {
  "/auth/register": {
    post: op({
      tag: AUTH, summary: "Register with email or phone + password", status: 201,
      body: json(
        {
          ...obj({ name: text, email: { type: "string", format: "email" }, phone: text, password: { type: "string", minLength: 8 } }, ["name", "password"]),
          description: "At least one of email or phone is required.",
        },
        { name: "Ali Rezaei", email: "ali@example.com", password: "Passw0rd!123" }
      ),
      response: ok(`Registered. ${cookieNote}`, { user: ex.user }),
      errors: [400, 409, 429],
    }),
  },
  "/auth/login": {
    post: op({
      tag: AUTH, summary: "Log in with email or phone + password",
      body: json(obj({ identifier: text, password: text }, ["identifier", "password"]), { identifier: "ali@example.com", password: "Passw0rd!123" }),
      response: ok(`Logged in. ${cookieNote}`, { user: ex.user }),
      errors: [400, 401, 429],
    }),
  },
  "/auth/logout": {
    post: op({ tag: AUTH, summary: "Log out (clears the cookie)", auth: "protect", response: ok("Logged out") }),
  },
  "/auth/me": {
    get: op({ tag: AUTH, summary: "Current user", auth: "protect", response: ok("Current user", { user: ex.user }) }),
  },
  "/auth/forgot-password": {
    post: op({
      tag: AUTH, summary: "Send a password reset email",
      body: json(obj({ email: { type: "string", format: "email" } }, ["email"]), { email: "ali@example.com" }),
      response: ok("Always the same response, whether or not the email exists"),
      errors: [400, 429],
    }),
  },
  "/auth/reset-password/{token}": {
    put: op({
      tag: AUTH, summary: "Set a new password using the emailed token (valid 10 minutes)",
      params: [pathParam("token", "Raw token from the reset email")],
      body: json(obj({ password: { type: "string", minLength: 8 } }, ["password"]), { password: "NewPassw0rd!456" }),
      response: ok(`Password changed. ${cookieNote}`, { user: ex.user }),
      errors: [400, 429],
    }),
  },

  "/users/profile": {
    put: op({
      tag: USERS, summary: "Update name and phone", auth: "protect",
      body: json(obj({ name: text, phone: text }), { name: "Ali R.", phone: "+491512345678" }),
      response: ok("Updated", { user: ex.user }), errors: [400, 409],
    }),
  },
  "/users/password": {
    put: op({
      tag: USERS, summary: "Change password", auth: "protect",
      body: json(obj({ currentPassword: text, newPassword: { type: "string", minLength: 8 } }, ["currentPassword", "newPassword"])),
      response: ok("Password changed"), errors: [400],
    }),
  },
  "/users/addresses": {
    post: op({
      tag: USERS, summary: "Add an address (max 5, only one default)", auth: "protect", status: 201,
      body: json(ref("Address")), response: ok("Added", { addresses: [ex.address] }), errors: [400],
    }),
  },
  "/users/addresses/{id}": {
    put: op({
      tag: USERS, summary: "Update an address", auth: "protect", params: [pathParam("id", "Address _id")],
      body: json(ref("Address")), response: ok("Updated", { addresses: [ex.address] }), errors: [400, 404],
    }),
    delete: op({
      tag: USERS, summary: "Delete an address", auth: "protect", params: [pathParam("id", "Address _id")],
      response: ok("Deleted", { addresses: [] }), errors: [404],
    }),
  },
};