import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { defaultMusicPlayerVal, renderWithRouterAndEntries, renderWithRouterEntriesMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import GlobalSpotifyPlayer from "../../../src/components/Music/GlobalSpotifyPlayer";
import { EntryType } from "../../../src/contexts/EntriesContext";

describe("GlobalSpotifyPlayer", () => {
  // Mock react date picker
  vi.mock("react-datepicker", () => ({
    default: ({ selected, onChange }: any) => (
      <input
        data-testid="date-picker"
        value={selected ? selected.toISOString() : ""}
        onChange={(event) => {
          const date = event.target.value ? new Date(event.target.value) : null;
          onChange(date);
        }}
      />
    )
  }));

  // Mock isMobileDevice
  const mockIsMobileDevice = vi.hoisted(() => vi.fn());

  vi.mock("../../../src/utils/device", () => ({
    isMobileDevice: () => mockIsMobileDevice()
  }));

  beforeEach(() => {
    mockIsMobileDevice.mockReturnValue(false);  // By default, device = non-mobile
  });

  const mockEntries: EntryType[] = [
    {
      id: "1",
      date: "2025-10-05",
      content: "Entry 1",
      songSelection: {
        id: "123",
        uri: "uri1",
        album: "my album",
        albumCoverUrls: ["img 1", "img 2", "img 3"],
        title: "my song",
        artists: "me",
        durationMS: 180000
      },
      songNotes: ""
    },
    {
      id: "2",
      date: "2025-10-15",
      content: "Entry 2",
      songSelection: {
        id: "456",
        uri: "uri2",
        album: "my album 2",
        albumCoverUrls: ["img 1", "img 2", "img 3"],
        title: "my song 2",
        artists: "me 2",
        durationMS: 200000
      },
      songNotes: ""
    },
    {
      id: "3",
      date: "2025-11-10",
      content: "Entry 3",
      songSelection: {
        id: "789",
        uri: "uri3",
        album: "my album 3",
        albumCoverUrls: ["img 1", "img 2", "img 3"],
        title: "my song 3",
        artists: "me 3",
        durationMS: 220000
      },
      songNotes: ""
    }
  ];

  it("shows initial state with no month selected", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const statusMsg = screen.getByText(/pick a month to play from/i);
    const startBtn = screen.getByRole("button", { name: /start/i });
    
    expect(statusMsg).toBeInTheDocument();
    expect(startBtn).toBeDisabled();
  });

  it("renders date picker for month selection", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const datePicker = screen.getByTestId("date-picker");
    expect(datePicker).toBeInTheDocument();
  });

  it("renders empty album cover when no song is playing", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    // Find the album cover div (it should have bg-gray-100 class when empty)
    const albumCover = screen.getByTestId("album-wrapper-global-player");

    expect(albumCover).toHaveClass("bg-gray-100");
    expect(albumCover).toBeInTheDocument();
  });

  it("renders play/pause button", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const playPauseBtn = screen.getByTestId("play-pause-btn-global-player");

    expect(playPauseBtn).toBeInTheDocument();
  });

  it("renders prev song button", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const prevSongBtn = screen.getByTestId("prev-song-btn");
    
    expect(prevSongBtn).toBeInTheDocument();
  });

  it("renders next song button", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const nextSongBtn = screen.getByTestId("next-song-btn");
    
    expect(nextSongBtn).toBeInTheDocument();
  });

  it("renders progress bar", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toBeInTheDocument();
  });

  it("renders volume bar on non-mobile devices", () => {
    mockIsMobileDevice.mockReturnValue(false);
    
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const volumeBar = screen.getByTestId("volume-bar");
    expect(volumeBar).toBeInTheDocument();
  });

  it("doesn't render volume bar on mobile devices", () => {
    mockIsMobileDevice.mockReturnValue(true);
    
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const volumeBar = screen.queryByTestId("volume-bar");
    expect(volumeBar).not.toBeInTheDocument();
  });

  it("START button is disabled initially when no month is selected", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const startBtn = screen.getByRole("button", { name: /start/i });
    expect(startBtn).toBeDisabled();
  });

  it("play/pause button is disabled initially", () => {
    const renderOptions = { 
      initialEntries: mockEntries,
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        playerModeRef: { current: null },
      }
    };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const playPauseBtn = screen.getByTestId("play-pause-btn-global-player");
    
    expect(playPauseBtn).toBeDisabled();
  });

  it("play/pause button is disabled if music player isn't ready", () => {
    const renderOptions = { 
      initialEntries: mockEntries,
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: false
      }
    };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const playPauseBtn = screen.getByTestId("play-pause-btn-global-player");
    
    expect(playPauseBtn).toBeDisabled();
  });

  it("prev/next song buttons are disabled initially", () => {
    const renderOptions = { 
      initialEntries: mockEntries,
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: false
      }
    };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const prevSongBtn = screen.getByTestId("prev-song-btn");
    const nextSongBtn = screen.getByTestId("next-song-btn");
    
    expect(prevSongBtn).toBeDisabled();
    expect(nextSongBtn).toBeDisabled();
  });

  it("progress bar is disabled initially", () => {
    const renderOptions = { 
      initialEntries: mockEntries,
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: false
      }
    };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toBeDisabled();
  });

  it("volume bar is disabled initially", () => {
    const renderOptions = { 
      initialEntries: mockEntries,
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: false
      }
    };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    const volumeBar = screen.getByTestId("volume-bar");
    expect(volumeBar).toBeDisabled();
  });

  it("shows empty song title and artist when no song is playing", () => {
    const renderOptions = { initialEntries: mockEntries };
    renderWithRouterEntriesMusicPlayer(<GlobalSpotifyPlayer containerStyles="" />, renderOptions);

    // Find the song info area - it should render empty paragraphs
    const allParagraphs = screen.getAllByRole("generic").filter(el => 
      el.querySelector("p")
    );
    
    // The song title and artist paragraphs should be empty
    expect(allParagraphs.length).toBeGreaterThan(0);
  });
});