import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Entry from "../../../src/components/Entry/Entry";
import "@testing-library/jest-dom/vitest";
import type { EntryType } from "../../../src/contexts/EntriesContext";
import { renderWithRouterEntriesMusicPlayer } from "../../test-utils";

describe("Entry", () => {
  const mockCheckLoginStatus = vi.fn();
  const mockSetIsLoggedIn = vi.fn();

  const mockEntry: EntryType = {
    id: "1",
    date: "2025-1-15",
    content: "I LOVE cats",
    songSelection: {
      id: "123",
      uri: "uri",
      album: "my album",
      albumCoverUrls: ["url1", "url2", "url3"],
      title: "my song",
      artists: "me",
      durationMS: 180000
    },
    songNotes: "Great song by me!"
  };

  vi.mock("react-loader-spinner", () => ({
    ColorRing: () => (
      <div data-testid="mini-player-loader"> Loading...</div>
    )
  }));

  vi.mock("../../../src/hooks/useBlocker", () => ({
    useBlocker: vi.fn()
  }));

  // Mock isMobileDevice
  const mockIsMobileDevice = vi.hoisted(() => vi.fn());

  vi.mock("../../../src/utils/device", () => ({
    isMobileDevice: () => mockIsMobileDevice()
  }));
  
  beforeEach(() => {
    mockIsMobileDevice.mockReturnValue(false); // By default, device = non-mobile
    vi.clearAllMocks();
  });

  it("renders the entry date", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    expect(screen.getByText(/january 15, 2025/i)).toBeInTheDocument();
  });

  it("renders entry content from existing entry", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const textarea = screen.getByTestId("entry-content-text-box");
    expect(textarea).toHaveValue("I LOVE cats");
  });

  it("renders empty text box for new entry", () => {
    const renderOptions = {
      route: "/entry/2025/1/20",
      routeHistory: ["/entry/2025/1/20"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("");
  });

  it("entry content is read-only when not editing", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const textarea = screen.getByTestId("entry-content-text-box");
    expect(textarea).toHaveAttribute("readonly");
  });

  it("shows Edit button when not editing", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  it("shows Save and Cancel buttons when editing", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("entry content becomes editable when Edit button is clicked", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const textarea = screen.getByTestId("entry-content-text-box");
    expect(textarea).toHaveAttribute("readonly");

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("allows user to type in text box when editing", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    const textarea = screen.getByTestId("entry-content-text-box");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "I LOVE LOVE LOVE LOVE cats");

    expect(textarea).toHaveValue("I LOVE LOVE LOVE LOVE cats");
  });

  it("shows Add Song button when editing", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    const addSongButton = screen.getByRole("button", { name: /add song/i });
    expect(addSongButton).toBeInTheDocument();
  });

  it("renders song selection when entry has a song", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    // Song selection should render the song title.
    expect(screen.getByText("my song")).toBeInTheDocument();
  });

  it("does not render song selection when entry has no song and not editing", () => {
    const entryWithoutSong: EntryType = {
      ...mockEntry,
      songSelection: null,
      songNotes: ""
    };

    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [entryWithoutSong]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    // Should not render song-related content.
    expect(screen.queryByText("my song")).not.toBeInTheDocument();
  });

  it("resets content when Cancel button is clicked", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    const textarea = screen.getByTestId("entry-content-text-box");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "meep");
    expect(textarea).toHaveValue("meep");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Should revert to original content.
    expect(textarea).toHaveValue("I LOVE cats");
  });

  it("exits edit mode when Cancel button is clicked", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Should show Edit button again.
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
  });

  it("exits edit mode when Save button is clicked", async () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    const cancelButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(cancelButton);

    // Should show Edit button again.
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });

  it("renders song notes when entry has song notes", () => {
    const renderOptions = {
      route: "/entry/2025/1/15",
      routeHistory: ["/entry/2025/1/15"],
      initialEntries: [mockEntry]
    };

    renderWithRouterEntriesMusicPlayer(
      <Entry 
        checkLoginStatus={mockCheckLoginStatus}
        setIsLoggedIn={mockSetIsLoggedIn}
        isLoggedIn={true}
      />,
      renderOptions
    );

    const songNotesTextarea = screen.getByPlaceholderText(/song notes/i);
    expect(songNotesTextarea).toHaveValue("Great song by me!");
  });
});