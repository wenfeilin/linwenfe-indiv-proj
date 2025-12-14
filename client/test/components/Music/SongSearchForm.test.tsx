import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import SongSearchForm from "../../../src/components/Music/SongSearchForm";

describe("SongSearchForm", () => {
  const mockSetSongSelection = vi.fn();
  const mockSetSongToPlay = vi.fn();
  const mockSetIsSearching = vi.fn();
  const mockSetUnsavedSongSelectionWasChanged = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input field", () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders search button", () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchBtn = screen.getByTestId("search-btn");
    expect(searchBtn).toBeInTheDocument();
  });

  it("search input is empty initially", () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    expect(searchInput).toHaveValue("");
  });

  it("allows user to type in search input", async () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    
    await userEvent.type(searchInput, "test song");
    
    expect(searchInput).toHaveValue("test song");
  });

  it("search input updates as user types", async () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    
    await userEvent.type(searchInput, "a");
    expect(searchInput).toHaveValue("a");
    
    await userEvent.type(searchInput, "bc");
    expect(searchInput).toHaveValue("abc");
  });

  it("search input can be cleared", async () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    
    await userEvent.type(searchInput, "test song");
    expect(searchInput).toHaveValue("test song");
    
    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue("");
  });

  it("doesn't show search results initially", () => {
    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    // Search results container should not be present initially.
    const searchResultsContainer = screen.queryByRole("list");
    expect(searchResultsContainer).not.toBeInTheDocument();
  });

  it("form can be submitted by pressing Enter", async () => {
    // Mock fetch to prevent actual API call
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => []
    });

    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    
    await userEvent.type(searchInput, "test song{Enter}");
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("form can be submitted by clicking search button", async () => {
    // Mock fetch to prevent actual API call
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => []
    });

    renderWithMusicPlayer(
      <SongSearchForm
        setSongSelection={mockSetSongSelection}
        setSongToPlay={mockSetSongToPlay}
        setIsSearching={mockSetIsSearching}
        savedSongSelection={null}
        songToPlay={null}
        songSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    await userEvent.type(searchInput, "test song");
    
    const searchBtn = screen.getByTestId("search-btn");
    await userEvent.click(searchBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});