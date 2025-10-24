import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CancelButton from "../../src/components/Entry/CancelButton";
import "@testing-library/jest-dom/vitest";

describe("CancelButton", () => {
  // Mock the onCancel function so it's callable in CancelButton component.
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    // Clear information about mock function.
    mockOnCancel.mockClear();
  })

  it("renders as clickable", () => {
    // Render the button.
    render(<CancelButton onCancel={mockOnCancel}/>);

    // Assert that the button shows "Cancel" and isn't disabled.
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Cancel");
    expect(button).not.toHaveAttribute("disabled");
  });

  it("calls onCancel when clicked", async () => {
    // Render the button.
    render(<CancelButton onCancel={mockOnCancel}/>);
    
    // Click the button.
    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Assert that the button still shows "Cancel" and calls mockOnCancel.
    expect(button).toHaveTextContent("Cancel");
    expect(mockOnCancel).toHaveBeenCalled();
  });
});