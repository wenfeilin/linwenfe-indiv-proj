import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithRouterAndEntries } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import ExportPlaylistButton from "../../../src/components/Music/ExportPlaylistButton";
import { EntryType } from "../../../src/contexts/EntriesContext";

describe("ExportPlaylistButton", () => {
  // Mock the set state functoins so they're callable in ExportPlaylistButton component.
  const mockSetPlaylistUrl = vi.fn();
  const mockSetShowExportPlaylistMsg = vi.fn();
  const mockSetExportPlaylistMsg = vi.fn();

  // Save original fetch function.
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Clear information about mock function.
    mockSetPlaylistUrl.mockClear();
    mockSetShowExportPlaylistMsg.mockClear();
    mockSetExportPlaylistMsg.mockClear();
  });

  afterEach(() => {
    // Restore original fetch function after each test.
    global.fetch = originalFetch;
  });

  it("shows Export", () => {
    const randomDate = new Date();

    render(<ExportPlaylistButton setPlaylistUrl={mockSetPlaylistUrl} selectedMonth={randomDate} setShowExportPlaylistMsg={mockSetShowExportPlaylistMsg} setExportPlaylistMsg={mockSetExportPlaylistMsg} />);

    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(/Export/i);
  });

  it("month has no songs to export (no song entries with song selection)", async () => {
    const date = new Date(2025, 9, 15); // 0-indexed month

    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-10-2",
        content: "merp",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "3",
        date: "2025-10-4",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    const renderOptions = {
      initialEntries: mockEntriesToRender
    }

    // Render the export button w/ mocked entries.
    renderWithRouterAndEntries(<ExportPlaylistButton setPlaylistUrl={mockSetPlaylistUrl} selectedMonth={date} setShowExportPlaylistMsg={mockSetShowExportPlaylistMsg} setExportPlaylistMsg={mockSetExportPlaylistMsg} />, renderOptions);

    // Click the Export button.
    const button = screen.getByRole("button");
    await userEvent.click(button);
    
    // Assert that there are indeed no songs to export.
    expect(mockSetPlaylistUrl).toHaveBeenCalledWith("N/A");
    expect(mockSetShowExportPlaylistMsg).toHaveBeenCalledWith(true);
    expect(mockSetExportPlaylistMsg).toHaveBeenCalledWith({ before: "You don't have any songs to export for Oct 2025."});
  });

  it("month has no songs to export (no entries)", async () => {
    const date = new Date(2025, 9, 15); // 0-indexed month

    const mockEntriesToRender: EntryType[] = [];

    const renderOptions = {
      initialEntries: mockEntriesToRender
    }

    // Render the export button w/ mocked entries.
    renderWithRouterAndEntries(<ExportPlaylistButton setPlaylistUrl={mockSetPlaylistUrl} selectedMonth={date} setShowExportPlaylistMsg={mockSetShowExportPlaylistMsg} setExportPlaylistMsg={mockSetExportPlaylistMsg} />, renderOptions);

    // Click the Export button.
    const button = screen.getByRole("button");
    await userEvent.click(button);
    
    // Assert that there are indeed no songs to export.
    expect(mockSetPlaylistUrl).toHaveBeenCalledWith("N/A");
    expect(mockSetShowExportPlaylistMsg).toHaveBeenCalledWith(true);
    expect(mockSetExportPlaylistMsg).toHaveBeenCalledWith({ before: "You don't have any songs to export for Oct 2025."});
  });

  it("month has songs to export", async () => {
    const date = new Date(2025, 9, 15);

    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-10-2",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2025-10-4",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    const renderOptions = {
      initialEntries: mockEntriesToRender
    }

    // Mock playlist ID.
    const mockedPlaylistId = "12345";

    // Mock the fetch API.
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        playlistId: mockedPlaylistId
      })
    })

    // Render the export button w/ mocked entries.
    renderWithRouterAndEntries(<ExportPlaylistButton setPlaylistUrl={mockSetPlaylistUrl} selectedMonth={date} setShowExportPlaylistMsg={mockSetShowExportPlaylistMsg} setExportPlaylistMsg={mockSetExportPlaylistMsg} />, renderOptions);

    // Click the Export button.
    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Wait for fetching to complete.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    })

    const expectedPlaylistUrl = `https://open.spotify.com/playlist/${mockedPlaylistId}`;

    // Assert that there are songs to export.
    expect(mockSetPlaylistUrl).toHaveBeenCalledWith(expectedPlaylistUrl);
    expect(mockSetShowExportPlaylistMsg).toHaveBeenCalledWith(true);
    expect(mockSetExportPlaylistMsg).toHaveBeenCalledWith({ 
      before: "Your", 
      linkText: "Oct 2025 playlist",
      after: "has been created on your Spotify account"
    });
  });

  it("no month selected to export playlist for", async () => {
    const date = null;

    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-10-2",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2025-10-4",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the export button w/ mocked entries.
    render(<ExportPlaylistButton setPlaylistUrl={mockSetPlaylistUrl} selectedMonth={date} setShowExportPlaylistMsg={mockSetShowExportPlaylistMsg} setExportPlaylistMsg={mockSetExportPlaylistMsg} />);

    // Click the Export button.
    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Assert that none of the set functions were called. (Nothing happened.)
    expect(mockSetPlaylistUrl).not.toHaveBeenCalled();
    expect(mockSetShowExportPlaylistMsg).not.toHaveBeenCalled();
    expect(mockSetExportPlaylistMsg).not.toHaveBeenCalled();
  });
});