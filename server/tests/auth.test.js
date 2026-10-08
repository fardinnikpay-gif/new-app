import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import { PASSWORD, createUser, createLoggedInUser } from "./helpers.js";

const validUser = { name: "Ali Rezaei", email: "ali@test.com", password: PASSWORD };
const hasHttpOnlyCookie = (res) =>
  (res.headers["set-cookie"] ?? []).some((cookie) => /httponly/i.test(cookie));

describe("POST /api/auth/register", () => {
  it("registers a user, sets an httpOnly cookie and never returns the password", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("ali@test.com");
    expect(res.body.data.user.password).toBeUndefined();
    expect(hasHttpOnlyCookie(res)).toBe(true);
  });

  it("returns 409 for a duplicate email", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when neither email nor phone is given", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "No Contact", password: PASSWORD });
    expect(res.status).toBe(400);
  });

  it("returns 400 for a password shorter than 8 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...validUser, password: "short" });
    expect(res.status).toBe(400);
  });

  it("never lets a client create an admin through registration", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...validUser, role: "admin" });

    expect([201, 400]).toContain(res.status);
    expect(await User.countDocuments({ role: "admin" })).toBe(0);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with email, sets a cookie and allows access to /auth/me", async () => {
    const user = await createUser();
    const agent = request.agent(app);

    const login = await agent.post("/api/auth/login").send({ identifier: user.email, password: PASSWORD });
    expect(login.status).toBe(200);
    expect(login.body.data.user.password).toBeUndefined();
    expect(hasHttpOnlyCookie(login)).toBe(true);

    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.data.user.email).toBe(user.email);
  });

  it("returns 401 with the SAME message for a wrong password and an unknown user", async () => {
    const user = await createUser();

    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ identifier: user.email, password: "WrongPassword1" });
    const unknownUser = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "nobody@test.com", password: PASSWORD });

    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownUser.body.message);
  });
});

describe("GET /api/auth/me and POST /api/auth/logout", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("logout clears the session", async () => {
    const { agent } = await createLoggedInUser(app);

    expect((await agent.post("/api/auth/logout")).status).toBe(200);
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });
});