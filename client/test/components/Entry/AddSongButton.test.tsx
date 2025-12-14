import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddSongButton from "../../../src/components/Entry/AddSongButton";
import "@testing-library/jest-dom/vitest";

describe("AddSongButton", () => {
  // Mock the setIsAddSongBtnActive and setIsSearching functions so they're callable in AddSongButton component.
  const mockSetIsAddSongBtnActive = vi.fn();
  const mockSetIsSearching = vi.fn();

  beforeEach(() => {
    // Clear information about mock function.
    mockSetIsAddSongBtnActive.mockClear();
    mockSetIsSearching.mockClear();
  });

  it(`renders with "Add Song" text and is clickable when not adding song`, () => {
    const isAddSongBtnActive = false; 

    // Render the button.
    render(<AddSongButton isAddSongBtnActive={isAddSongBtnActive} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} setIsSearching={mockSetIsSearching} />);

    // Assert that the button shows "Add Song" and isn't disabled.
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Add Song");

    // Assert the button is not active (and so it's also not searching for songs).
    expect(mockSetIsAddSongBtnActive).not.toHaveBeenCalled();
    expect(mockSetIsSearching).not.toHaveBeenCalled();
  });

  it("makes Add Song button active and indicates searching when clicked", async () => {
    // Render the button.
    const { rerender } = render(<AddSongButton isAddSongBtnActive={false} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} setIsSearching={mockSetIsSearching} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
    
    // Click the button.
    await userEvent.click(button);

    // Simulate the button being disabled.
    rerender(<AddSongButton isAddSongBtnActive={true} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} setIsSearching={mockSetIsSearching} />);

    // Assert that the button and is disabled.
    expect(button).toBeDisabled();
    expect(mockSetIsAddSongBtnActive).toHaveBeenCalledWith(true);
    expect(mockSetIsSearching).toHaveBeenCalledWith(true);
  });

  it("renders as disabled when already adding song", () => {
    const isAddSongBtnActive = true; 

    // Render the button.
    render(<AddSongButton isAddSongBtnActive={isAddSongBtnActive} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} setIsSearching={mockSetIsSearching} />);
    
    // Assert that the button is disabled.
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});