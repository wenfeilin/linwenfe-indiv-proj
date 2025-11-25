import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Entry from "../../src/components/Entry/Entry";
import "@testing-library/jest-dom/vitest";




/*
Not done! (at all)
*/




describe("Entry", () => {
  it("placeholder test", () => {
    
    expect(true).toBeTruthy();
  });
  // // Mock the onEdit and setIsAddSongBtnActive functions so it's callable in EditButton component.
  // const mockOnEdit = vi.fn();
  // const mockSetIsAddSongBtnActive = vi.fn();

  // beforeEach(() => {
  //   // Clear information about mock functions.
  //   mockOnEdit.mockClear();
  //   mockSetIsAddSongBtnActive.mockClear();
  // })

  // const noSongSelection = null;

  // it("renders as clickable", () => {
  //   // Render the button.
  //   render(<EditButton onEdit={mockOnEdit} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} songSelection={noSongSelection}/>);

  //   // Assert that the button shows "Edit" and isn't disabled.
  //   const button = screen.getByRole("button");
  //   expect(button).toHaveTextContent("Edit");
  //   expect(button).not.toHaveAttribute("disabled");
  // });

  // it("only calls onEdit when clicked without a song selection", async () => {
  //   // Render the button.
  //   render(<EditButton onEdit={mockOnEdit} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} songSelection={noSongSelection}/>);
    
  //   // Click the button.
  //   const button = screen.getByRole("button");
  //   await userEvent.click(button);

  //   // Assert that the button only calls mockOnEdit.
  //   expect(mockOnEdit).toHaveBeenCalled();
  //   expect(mockSetIsAddSongBtnActive).not.toHaveBeenCalled();
  // });

  // it("calls onEdit and setIsAddSongBtnActive (with true) when clicked with a song selection", async () => {
  //   const songSelection = {
  //     id: "0",
  //     uri: "some-uri",
  //     album: "you & me",
  //     albumCoverUrls: ["a-cover.jpg"],
  //     title: "you",
  //     artists: "me",
  //     durationMS: 10,
  //   };

  //   // Render the button.
  //   render(<EditButton onEdit={mockOnEdit} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} songSelection={songSelection}/>);
    
  //   // Click the button.
  //   const button = screen.getByRole("button");
  //   await userEvent.click(button);

  //   // Assert that the button calls mockOnEdit and mockSetIsAddSongBtnActive.
  //   expect(mockOnEdit).toHaveBeenCalled();
  //   expect(mockSetIsAddSongBtnActive).toHaveBeenCalledWith(true);
  // });
});