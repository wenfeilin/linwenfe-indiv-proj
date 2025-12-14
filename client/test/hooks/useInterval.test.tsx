import React from "react";
import { renderHook, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import useInterval from "../../src/hooks/useInterval";

describe("useInterval hook", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // for testing purposes
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("calls callback at specified interval", () => {
    const callback = vi.fn();
    const delay = 1000;

    renderHook(() => useInterval(callback, delay));

    expect(callback).not.toHaveBeenCalled();

    // Fast forward 1 second
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Fast forward another second
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("does not call callback when delay is null", () => {
    const callback = vi.fn();

    renderHook(() => useInterval(callback, null));

    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("calls callback multiple times at correct intervals", () => {
    const callback = vi.fn();
    const delay = 500;

    renderHook(() => useInterval(callback, delay));

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("pauses interval when delay changes to null", () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ delay }: { delay: number | null}) => useInterval(callback, delay),
      { initialProps: { delay: 1000 as number | null } } // Add the type declarations, otherwise TS is unhappy
    );

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Change delay to null (pause)
    rerender({ delay: null });

    vi.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it("resumes interval when delay changes from null (unpaused)", () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ delay }: { delay: number | null}) => useInterval(callback, delay),
      { initialProps: { delay: null as number | null } } // Add the type declarations, otherwise TS is unhappy
    );

    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();

    // Resume with delay
    rerender({ delay: 1000 });

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cleans up interval on unmount", () => {
    const callback = vi.fn();
    const delay = 1000;

    const { unmount } = renderHook(() => useInterval(callback, delay));

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    // After unmount, callback should not be called
    vi.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});