module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  testMatch: ["**/*.spec.[jt]s?(x)"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(@jamescoyle/vue-icon|vee-validate)/)",
  ],
  setupFiles: ["./crypto.js"],
  setupFilesAfterEnv: ["./cookieJar.js"],
};
