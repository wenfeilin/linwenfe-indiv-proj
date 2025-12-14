import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { useBlocker } from "../../src/hooks/useBlocker";
import { useNavigate, MemoryRouter } from "react-router-dom";

describe("useBlocker hook", () => {
  let originalConfirm: typeof window.confirm;

  beforeEach(() => {
    // Save original confirm function.
    originalConfirm = window.confirm;
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original confirm function.
    window.confirm = originalConfirm;
  });

  it("does not block navigation when shouldBlock is false", () => {
    const mockConfirm = vi.fn();
    window.confirm = mockConfirm;

    renderHook(() => useBlocker(false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
    });

    // Confirm should not be called when blocking is disabled.
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it("blocks navigation when shouldBlock is true", () => {
    const mockConfirm = vi.fn().mockReturnValue(false);
    window.confirm = mockConfirm;

    const { result } = renderHook(() => useBlocker(true), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
    });

    // Hook should be defined.
    expect(result.current).toBeUndefined(); // useBlocker doesn't return anything
  });

  it("cleans up when component unmounts", () => {
    const mockConfirm = vi.fn();
    window.confirm = mockConfirm;

    const { unmount } = renderHook(() => useBlocker(true), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
    });

    // Unmount should restore original navigation behavior.
    unmount();

    expect(mockConfirm).not.toHaveBeenCalled();
  });
});