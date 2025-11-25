import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../test-utils"
import SaveButton from "../../src/components/Entry/SaveButton";
import "@testing-library/jest-dom/vitest";

describe("SaveButton", () => {
  it("placeholder test", () => {
    
    expect(true).toBeTruthy();
  });
  
  // Mock the child components.
  // vi.mock("../../src/components/Calendar/CalendarHeader", () => ({
  //   default: () => (<div data-testid="calendar-header">Mocked Calendar Header</div>)
  // }));
  
  // vi.mock("../../src/components/Calendar/CalendarBlock", () => ({
  //   default: ({ blockDate }: { blockDate: Date }) => (<div data-testid="calendar-block">{`${blockDate.getFullYear()}-${blockDate.getMonth() + 1}-${blockDate.getDate()}`}</div>)
  // }));
  
  // Not sure why this has to be mocked b/c it doesn't look like the SaveButton component
  // is using it, but a TypeError is caused without mocking this.
  vi.mock("react-loader-spinner", () => ({
    RotatingLines: () => (
      <div data-testid="loading-spinner"> Loading...</div>
    )
  }));

  // Create a mock of useParams function (but keep everything else in react-router the same).
  // vi.mock("react-router", async () => {
  //   const actual = await vi.importActual<typeof import("react-router")>("react-router");
    
  //   return {
  //     ...actual,
  //     useParams: vi.fn().mockReturnValue({
  //       // Set valid default mock values.
  //       year: "2025",
  //       month: "1",
  //     })
  //   };
  // });
  
  // Mock the props that are functions so they're callable in SaveButton component.
  const mockSetIsAddSongBtnActive = vi.fn();
  const mockOnSave = vi.fn();
  const mockSetIsSearching = vi.fn();
  const mockSetSearchedSongToPlay = vi.fn();
  
  beforeEach(() => {
    // Clear information about mock functions.
    mockSetIsAddSongBtnActive.mockClear();
    mockOnSave.mockClear();
    mockSetIsSearching.mockClear();
    mockSetSearchedSongToPlay.mockClear();
  })
  
  /*
  newEntryContent,
  newSongSelection,
  newSongNotes,
  entryBeingSaved,
  setIsAddSongBtnActive,
  onSave,
  setIsSearching,
  setSearchedSongToPlay,
  unsavedSongSelectionWasChanged,

  type EntryType = {
    id: string;
    date: string;
    content: string;
    songSelection: Song | null;
    songNotes: string;
  }
   */
  const newEntryContent = "";
  const newSongSelection = null;
  const newSongNotes = "";
  const entryBeingSaved = undefined;
  const unsavedSongSelectionWasChanged = false;

  
  it("renders as clickable", () => {
    // Render the button.
    render(<SaveButton newEntryContent={newEntryContent} newSongSelection={newSongSelection}
      newSongNotes={newSongNotes} entryBeingSaved={entryBeingSaved} setIsAddSongBtnActive={mockSetIsAddSongBtnActive} onSave={mockOnSave} setIsSearching={mockSetIsSearching}setSearchedSongToPlay={mockSetSearchedSongToPlay} unsavedSongSelectionWasChanged={unsavedSongSelectionWasChanged} />);
      
      // Assert that the button shows "Save" and isn't disabled.
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Save");
      expect(button).not.toHaveAttribute("disabled");
    });
    
    const renderOptions = {
      initialEntries: []
    };

  //   it("only calls onEdit when clicked without a song selection", async () => {
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