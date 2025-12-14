import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import SavedSongIndicator from "../../../src/components/Music/SavedSongIndicator";
import type { Song } from "../../../src/components/Music/SongSelection";

describe("SavedSongIndicator", () => {
  it(`renders "Saved:"`, () => {
    const savedSong: Song = {
      id: "123",
      uri: "uri",
      album: "an album",
      albumCoverUrls: ["cover 1", "cover 2"],
      title: "The Best Song",
      artists: "me",
      durationMS: 18000
    };

    render(<SavedSongIndicator savedSongSelection={savedSong} />);

    // Assert song title and artist(s) appear.
    const text = screen.getByRole("paragraph");
    expect(text).toHaveTextContent(/Saved:/i);
  });

  it("shows the saved song and artist(s)", () => {
    const savedSong: Song = {
      id: "123",
      uri: "uri",
      album: "an album",
      albumCoverUrls: ["cover 1", "cover 2"],
      title: "The Best Song",
      artists: "me",
      durationMS: 18000
    };

    render(<SavedSongIndicator savedSongSelection={savedSong} />);

    // Assert song title and artist(s) appear.
    const text = screen.getByRole("paragraph");
    expect(text).toHaveTextContent(/The Best Song by me/i);
  });

  it("shows none for no existing saved song", () => {
    const savedSong = null;
    render(<SavedSongIndicator savedSongSelection={savedSong} />);

    // Assert "none" appears.
    const text = screen.getByText(/none/i);
    expect(text).toBeInTheDocument();
  });
});