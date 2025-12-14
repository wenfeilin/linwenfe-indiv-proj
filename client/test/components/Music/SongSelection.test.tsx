import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import SongSelection, { Song } from "../../../src/components/Music/SongSelection";

describe("SongSelection", () => {
  vi.mock("react-loader-spinner", () => ({
    ColorRing: () => (
      <div data-testid="reg-player-loader"> Loading...</div>
    )
  }));

  // Mock isMobileDevice
  const mockIsMobileDevice = vi.hoisted(() => vi.fn());

  vi.mock("../../../src/utils/device", () => ({
    isMobileDevice: () => mockIsMobileDevice()
  }));

  beforeEach(() => {
    mockIsMobileDevice.mockReturnValue(false); // By default, device = non-mobile
  });

  const mockSetIsAddSongBtnActive = vi.fn();
  const mockSetSongSelection = vi.fn();
  const mockSetSongNotes = vi.fn();
  const mockOnEdit = vi.fn();
  const mockSetIsSearching = vi.fn();
  const mockSetSearchedSongToPlay = vi.fn();
  const mockSetUnsavedSongSelectionWasChanged = vi.fn();
  const mockCheckLoginStatus = vi.fn();
  const mockSetIsLoggedIn = vi.fn();

  const mockSong: Song = {
    id: "123",
    uri: "uri1",
    album: "my album",
    albumCoverUrls: ["url1", "url2", "url3"],
    title: "my song",
    artists: "me",
    durationMS: 180000
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when song selection is null and Add Song button is not active", () => {
    const { container } = renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={false}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={null}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    // Should render the outer container but nothing inside
    const innerContainer = container.querySelector(".grid");
    expect(innerContainer?.children.length).toBe(0);
  });

  it("shows login message when user is not logged in", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={null}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={false}
      />
    );

    const loginMsg = screen.getByText(/log in to spotify to use music features/i);
    expect(loginMsg).toBeInTheDocument();
  });

  it("doesn't render X button when not editing", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const xBtn = screen.queryByTestId("x-btn");
    expect(xBtn).not.toBeInTheDocument();
  });

  it("renders X button when editing", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const xBtn = screen.getByTestId("x-btn");
    expect(xBtn).toBeInTheDocument();
  });

  it("calls callbacks when X button is clicked", async () => {
    const mockSetIsAddSongBtnActive = vi.fn();
    const mockSetSongSelection = vi.fn();
    const mockSetSongNotes = vi.fn();
    const mockSetIsSearching = vi.fn();
    const mockSetSearchedSongToPlay = vi.fn();

    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes="some notes"
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const xBtn = screen.getByTestId("x-btn");
    await userEvent.click(xBtn);

    expect(mockSetIsAddSongBtnActive).toHaveBeenCalledWith(false);
    expect(mockSetSongSelection).toHaveBeenCalledWith(null);
    expect(mockSetSongNotes).toHaveBeenCalledWith("");
    expect(mockSetIsSearching).toHaveBeenCalledWith(false);
    expect(mockSetSearchedSongToPlay).toHaveBeenCalledWith(null);
  });

  it("renders song notes textarea when editing with Add Song button active", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).toBeInTheDocument();
  });

  it("renders song notes textarea when there are existing song notes", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes="My song notes"
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).toBeInTheDocument();
    expect(songNotesTextarea).toHaveValue("My song notes");
  });

  it("song notes textarea is read-only when not editing", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes="My song notes"
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).toHaveAttribute("readonly");
  });

  it("song notes textarea is editable when editing", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).not.toHaveAttribute("readonly");
  });

  it("calls onEdit when user types in song notes textarea", async () => {
    const mockOnEdit = vi.fn();

    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    await userEvent.type(songNotesTextarea, "a");

    expect(mockOnEdit).toHaveBeenCalled();
    expect(mockOnEdit.mock.calls[0][1]).toBe("song notes");
  });

  it("doesn't render song notes textarea when not editing and no notes exist", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const songNotesTextarea = screen.queryByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).not.toBeInTheDocument();
  });

  it("renders RegularPlayer when song selection exists", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    // The regular player should render song title, so check for that.
    expect(screen.getByText("my song")).toBeInTheDocument();
  });

  it("renders SongSearchForm when searching and no song selection", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={null}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={true}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    // The song search form should render search input, so search for that.
    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders SongSearchForm when editing, searching, and Add Song button is active", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={true}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a song/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders MiniSpotifyPlayer when searching and there's a searched song to play", () => {
    const searchedSong: Song = {
      id: "456",
      uri: "uri2",
      album: "searched album",
      albumCoverUrls: ["url4", "url5", "url6"],
      title: "searched song",
      artists: "searched artist",
      durationMS: 200000
    };

    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={true}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={searchedSong}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    // The mini spotify player should display the searched song, so check for that.
    expect(screen.getByText("searched song")).toBeInTheDocument();
  });

  it("renders song indicators when editing with Add Song button active", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={true}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    // Song indicators should be present (saved and selected song indicators)
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("doesn't render song indicators when not editing", () => {
    renderWithMusicPlayer(
      <SongSelection
        isEditing={false}
        isAddSongBtnActive={true}
        setIsAddSongBtnActive={mockSetIsAddSongBtnActive}
        songSelection={mockSong}
        setSongSelection={mockSetSongSelection}
        songNotes=""
        setSongNotes={mockSetSongNotes}
        onEdit={mockOnEdit}
        isSearching={false}
        setIsSearching={mockSetIsSearching}
        searchedSongToPlay={null}
        setSearchedSongToPlay={mockSetSearchedSongToPlay}
        savedSongSelection={null}
        unsavedSongSelectionWasChanged={false}
        setUnsavedSongSelectionWasChanged={mockSetUnsavedSongSelectionWasChanged}
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />
    );

    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });
});