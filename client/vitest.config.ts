import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // Runs this file before running tests.
    setupFiles: "./test/setup",
  },
});
