import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddSongButton from "../../src/components/Entry/AddSongButton";
import "@testing-library/jest-dom/vitest";

describe("AddSongButton", () => {
  // Mock the setIsAddSongBtnActive function so it's callable in AddSongButton component.
  const mockSetIsAddSongBtnActive = vi.fn();

  beforeEach(() => {
    // Clear information about mock function.
    mockSetIsAddSongBtnActive.mockClear();
  })

  it("renders as clickable when not adding song", () => {
    const isAddSongBtnActive = false; 

    // Render the button.
    render(<AddSongButton isAddSongBtnActive={isAddSongBtnActive} setIsAddSongBtnActive={mockSetIsAddSongBtnActive}/>);

    // Assert that the button shows "Add Song" and isn't disabled.
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Add Song");
    expect(button).not.toHaveAttribute("disabled");
  });

  it("calls setIsAddSongBtnActive with true when clicked", async () => {
    const isAddSongBtnActive = false; 

    // Render the button.
    render(<AddSongButton isAddSongBtnActive={isAddSongBtnActive} setIsAddSongBtnActive={mockSetIsAddSongBtnActive}/>);
    
    // Click the button.
    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Assert that the button still shows "Add Song" and is disabled.
    expect(button).toHaveTextContent("Add Song");
    expect(mockSetIsAddSongBtnActive).toHaveBeenCalledWith(true);
  });

  it("renders as disabled when already adding song", () => {
    const isAddSongBtnActive = true; 

    // Render the button.
    render(<AddSongButton isAddSongBtnActive={isAddSongBtnActive} setIsAddSongBtnActive={mockSetIsAddSongBtnActive}/>);
    
    // Assert that the button is disabled.
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");
  });
});