import { jest } from "@jest/globals";
import "dotenv/config";
import mongoose from "mongoose";

const getDbName = (uri) => uri?.match(/\/([^/?]+)(?:\?|$)/)?.[1] ?? "";



// No real emails in tests (registering and ordering both send one)
jest.unstable_mockModule("../src/services/emailService.js", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Make sure unique/text indexes exist before the first test relies on them
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init())
  );
});
beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});