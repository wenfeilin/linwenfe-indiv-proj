import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Clean up after every test.
afterEach(() => {
  // Removes rendered React components.
  cleanup();
  // Reset all mocks.
  vi.clearAllMocks();
});
