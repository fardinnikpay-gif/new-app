export default {
  testEnvironment: "node",
  transform: {}, // native ES modules, no Babel
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 20000,
};