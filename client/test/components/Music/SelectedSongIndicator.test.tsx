import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import SelectedSongIndicator from "../../../src/components/Music/SelectedSongIndicator";
import { Song } from "../../../src/components/Music/SongSelection";

describe("SelectedSongIndicator", () => {
  it(`renders "Selected (unsaved):"`, () => {
    const savedSong: Song = {
      id: "123",
      uri: "uri",
      album: "an album",
      albumCoverUrls: ["cover 1", "cover 2"],
      title: "The Best Song",
      artists: "me",
      durationMS: 18000
    };

    render(<SelectedSongIndicator songSelection={savedSong} />);

    // Assert song title and artist(s) appear.
    const text = screen.getByRole("paragraph");
    expect(text).toHaveTextContent(/Selected \(unsaved\):/i);
  });

  it("shows the selected song and artist(s)", () => {
    const savedSong: Song = {
      id: "123",
      uri: "uri",
      album: "an album",
      albumCoverUrls: ["cover 1", "cover 2"],
      title: "The Best Song",
      artists: "me",
      durationMS: 18000
    };

    render(<SelectedSongIndicator songSelection={savedSong} />);

    // Assert song title and artist(s) appear.
    const text = screen.getByRole("paragraph");
    expect(text).toHaveTextContent(/The Best Song by me/i);
  });

  it("shows none for no existing selected song", () => {
    const savedSong = null;
    render(<SelectedSongIndicator songSelection={savedSong} />);

    // Assert "none" appears.
    const text = screen.getByText(/none/i);
    expect(text).toBeInTheDocument();
  });
});