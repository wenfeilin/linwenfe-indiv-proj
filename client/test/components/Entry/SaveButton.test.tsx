import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterEntriesMusicPlayer } from "../../test-utils"
import SaveButton from "../../../src/components/Entry/SaveButton";
import "@testing-library/jest-dom/vitest";
import { EntryType } from "../../../src/contexts/EntriesContext";
import { Song } from "../../../src/components/Music/SongSelection";

describe("SaveButton", () => {
  const mockSetIsAddSongBtnActive = vi.fn();
  const mockOnSave = vi.fn();
  const mockSetIsSearching = vi.fn();
  const mockSetSearchedSongToPlay = vi.fn();

  const mockSong: Song = {
    id: "123",
    uri: "uri",
    album: "my album",
    albumCoverUrls: ["url1", "url2", "url3"],
    title: "my song",
    artists: "me",
    durationMS: 180000
  };

  const mockEntry: EntryType = {
    id: "16",
    date: "2025-1-15",
    content: "hi there!",
    songSelection: mockSong,
    songNotes: "good song... b/c it's by me"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Save button", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"]
    };

    renderWithRouterEntriesMusicPlayer(
      <SaveButton
        newEntryContent=""
        newSongSelection={null}
        newSongNotes=""
        entryBeingSaved={undefined}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        onSave={mockOnSave}
        setIsSearching={mockSetIsSearching}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        unsavedSongSelectionWasChanged={false}
      />,
      renderOptions
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });

  it("calls onSave when clicked", async () => {
    const mockOnSave = vi.fn();

    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"]
    };

    renderWithRouterEntriesMusicPlayer(
      <SaveButton
        newEntryContent=""
        newSongSelection={null}
        newSongNotes=""
        entryBeingSaved={undefined}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        onSave={mockOnSave}
        setIsSearching={mockSetIsSearching}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        unsavedSongSelectionWasChanged={false}
      />,
      renderOptions
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  describe("exits out of edit mode when pressed", () => {
    it("calls setIsAddSongBtnActive with false when clicked", async () => {
      const mockSetIsAddSongBtnActive = vi.fn();
  
      const renderOptions = {
        route: "/entry/2025/1/15",
        routeHistory: ["/entry/2025/1/15"]
      };
  
      renderWithRouterEntriesMusicPlayer(
        <SaveButton
          newEntryContent=""
          newSongSelection={null}
          newSongNotes=""
          entryBeingSaved={undefined}
          setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
          onSave={mockOnSave}
          setIsSearching={mockSetIsSearching}
          setSearchedSongToPlay={mockSetSearchedSongToPlay}
          unsavedSongSelectionWasChanged={false}
        />,
        renderOptions
      );
  
      const saveButton = screen.getByRole("button", { name: /save/i });
      await userEvent.click(saveButton);
  
      expect(mockSetIsAddSongBtnActive).toHaveBeenCalledWith(false);
    });
  
    it("calls setIsSearching with false when clicked", async () => {
      const mockSetIsSearching = vi.fn();
  
      const renderOptions = {
        route: "/entry/2025/1/15",
        routeHistory: ["/entry/2025/1/15"]
      };
  
      renderWithRouterEntriesMusicPlayer(
        <SaveButton
          newEntryContent=""
          newSongSelection={null}
          newSongNotes=""
          entryBeingSaved={undefined}
          setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
          onSave={mockOnSave}
          setIsSearching={mockSetIsSearching}
          setSearchedSongToPlay={mockSetSearchedSongToPlay}
          unsavedSongSelectionWasChanged={false}
        />,
        renderOptions
      );
  
      const saveButton = screen.getByRole("button", { name: /save/i });
      await userEvent.click(saveButton);
  
      expect(mockSetIsSearching).toHaveBeenCalledWith(false);
    });
  
    it("calls setSearchedSongToPlay with null when no song selection", async () => {
      const mockSetSearchedSongToPlay = vi.fn();
  
      const renderOptions = {
        route: "/entry/2025/1/15",
        routeHistory: ["/entry/2025/1/15"]
      };
  
      renderWithRouterEntriesMusicPlayer(
        <SaveButton
          newEntryContent="Some content"
          newSongSelection={null}
          newSongNotes=""
          entryBeingSaved={mockEntry}
          setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
          onSave={mockOnSave}
          setIsSearching={mockSetIsSearching}
          setSearchedSongToPlay={mockSetSearchedSongToPlay}
          unsavedSongSelectionWasChanged={false}
        />,
        renderOptions
      );
  
      const saveButton = screen.getByRole("button", { name: /save/i });
      await userEvent.click(saveButton);
  
      expect(mockSetSearchedSongToPlay).toHaveBeenCalledWith(null);
    });
  });
});