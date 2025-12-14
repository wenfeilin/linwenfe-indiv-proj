import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import ConditionalMusicProvider from "../../../src/components/Music/ConditionalMusicProvider";

// Mock the music player context.
vi.mock("../../../src/contexts/MusicPlayerContext", () => ({
  MusicPlayerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="music-player-provider">{children}</div>
  ),
  useMusicPlayer: vi.fn()
}));

// Mock useSpotifyPlayer hook to avoid SDK initialization.
vi.mock("../../../src/hooks/useSpotifyPlayer", () => ({
  default: () => ({
    isReady: true,
    currentSong: null,
    togglePlay: vi.fn(),
    queueSong: vi.fn(),
    queueMonthOfSongs: vi.fn(),
    pause: vi.fn(),
    seek: vi.fn(),
    setNewVolume: vi.fn(),
    getProgress: vi.fn().mockResolvedValue(0),
    playPrevSong: vi.fn(),
    playNextSong: vi.fn(),
  })
}));

vi.mock("../../../src/hooks/useInterval", () => ({
  default: vi.fn()
}));

describe("ConditionalMusicProvider", () => {
  it("renders children when user is not logged in", () => {
    render(
      <ConditionalMusicProvider isLoggedIn={false}>
        <div data-testid="child-content">Some content</div>
      </ConditionalMusicProvider>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toHaveTextContent("Some content");
  });

  it("does not wrap children with MusicPlayerProvider when not logged in", () => {
    render(
      <ConditionalMusicProvider isLoggedIn={false}>
        <div data-testid="child-content">Some content</div>
      </ConditionalMusicProvider>
    );

    expect(screen.queryByTestId("music-player-provider")).not.toBeInTheDocument();
  });

  it("renders children when user is logged in", () => {
    render(
      <ConditionalMusicProvider isLoggedIn={true}>
        <div data-testid="child-content">Some content</div>
      </ConditionalMusicProvider>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toHaveTextContent("Some content");
  });

  it("wraps children with MusicPlayerProvider when logged in", () => {
    render(
      <ConditionalMusicProvider isLoggedIn={true}>
        <div data-testid="child-content">Some content</div>
      </ConditionalMusicProvider>
    );

    expect(screen.getByTestId("music-player-provider")).toBeInTheDocument();
  });
});