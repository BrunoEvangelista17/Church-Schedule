export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: ["routers/**/*.js", "!**/node_modules/**"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testTimeout: 10000,
  transform: {},
};
