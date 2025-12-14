import React, { act } from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MusicPlayerProvider, useMusicPlayer } from "../../src/contexts/MusicPlayerContext";
import { Song } from "../../src/components/Music/SongSelection";
// import { MusicPlayerContext } from "../../src/contexts/MusicPlayerContext";

// Mock the Spotify player hook
vi.mock("../../src/hooks/useSpotifyPlayer", () => ({
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

// Mock the useInterval hook
vi.mock("../../src/hooks/useInterval", () => ({
  default: vi.fn()
}));

describe("MusicPlayerContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSong: Song = {
    id: "123",
    uri: "spotify:track:123",
    album: "Test Album",
    albumCoverUrls: ["url1", "url2", "url3"],
    title: "Test Song",
    artists: "Test Artist",
    durationMS: 180000
  };

  it("provides initial state for entry player", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    expect(result.current?.isReady).toBe(true);
    expect(result.current?.isPlaying).toBe(false);
    expect(result.current?.progress).toBe(0);
    expect(result.current?.trackToPlay).toBeNull();
    expect(result.current?.currentContext).toBeNull();
    expect(result.current?.isLoadingSong).toBe(false);
  });

  it("provides initial state for calendar player", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    expect(result.current?.isPlayingGlobal).toBe(false);
    expect(result.current?.progressGlobal).toBe(0);
    expect(result.current?.isLoadingSongGlobal).toBe(false);
    expect(result.current?.currentSong).toBeNull();
  });

  it("provides initial state for shared player properties", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    expect(result.current?.playerModeRef.current).toBeNull();
    expect(result.current?.previouslyPlayedModeRef.current).toBeNull();
    expect(result.current?.volume).toBe(1);
    expect(result.current?.isScrubbingProgress.current).toBe(false);
    expect(result.current?.isScrubbingProgressGlobal.current).toBe(false);
  });

  it("updates trackToPlay state", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setTrackToPlay(mockSong);
    });

    expect(result.current?.trackToPlay).toEqual(mockSong);
  });

  it("resets trackToPlay to null", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setTrackToPlay(mockSong);
    });

    expect(result.current?.trackToPlay).toEqual(mockSong);

    act(() => {
      result.current?.setTrackToPlay(null);
    });

    expect(result.current?.trackToPlay).toBeNull();
  });

  it("updates progress state", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgress(50000);
    });

    expect(result.current?.progress).toBe(50000);
  });

  it("updates progressGlobal state", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgressGlobal(75000);
    });

    expect(result.current?.progressGlobal).toBe(75000);
  });

  it("updates currentContext state", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setCurrentContext(mockSong);
    });

    expect(result.current?.currentContext).toEqual(mockSong);
  });

  it("updates isLoadingSongGlobal state", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setIsLoadingSongGlobal(true);
    });

    expect(result.current?.isLoadingSongGlobal).toBe(true);

    act(() => {
      result.current?.setIsLoadingSongGlobal(false);
    });

    expect(result.current?.isLoadingSongGlobal).toBe(false);
  });

  it("updates playerModeRef when updatePlayerState is called", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    expect(result.current?.playerModeRef.current).toBeNull();

    act(() => {
      result.current?.updatePlayerState("entry");
    });

    expect(result.current?.playerModeRef.current).toBe("entry");
  });

  it("updates previouslyPlayedModeRef when updatePlayerState is called", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.updatePlayerState("entry");
    });

    expect(result.current?.previouslyPlayedModeRef.current).toBeNull();

    act(() => {
      result.current?.updatePlayerState("calendar");
    });

    expect(result.current?.previouslyPlayedModeRef.current).toBe("entry");
  });

  it("resets calendar player progress when switching to entry player", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgressGlobal(50000);
      result.current?.updatePlayerState("calendar");
    });

    expect(result.current?.progressGlobal).toBe(50000);

    act(() => {
      result.current?.updatePlayerState("entry");
    });

    expect(result.current?.progressGlobal).toBe(0);
  });

  it("resets entry player progress when switching to calendar player", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgress(50000);
      result.current?.updatePlayerState("entry");
    });

    expect(result.current?.progress).toBe(50000);

    act(() => {
      result.current?.updatePlayerState("calendar");
    });

    expect(result.current?.progress).toBe(0);
  });

  it("resets entry player visual progress", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgress(50000);
    });

    expect(result.current?.progress).toBe(50000);

    act(() => {
      result.current?.resetVisualProgress("entry");
    });

    expect(result.current?.progress).toBe(0);
  });

  it("resets calendar player visual progress", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    act(() => {
      result.current?.setProgressGlobal(75000);
    });

    expect(result.current?.progressGlobal).toBe(75000);

    act(() => {
      result.current?.resetVisualProgress("calendar");
    });

    expect(result.current?.progressGlobal).toBe(0);
  });

  it("provides all required functions", () => {
    const { result } = renderHook(() => useMusicPlayer(), {
      wrapper: MusicPlayerProvider
    });

    // Entry player functions
    expect(typeof result.current?.togglePlay).toBe("function");
    expect(typeof result.current?.setProgress).toBe("function");
    expect(typeof result.current?.setTrackToPlay).toBe("function");

    // Calendar player functions
    expect(typeof result.current?.togglePlayGlobal).toBe("function");
    expect(typeof result.current?.queueAndPlaySongs).toBe("function");
    expect(typeof result.current?.setProgressGlobal).toBe("function");
    expect(typeof result.current?.setIsLoadingSongGlobal).toBe("function");
    expect(typeof result.current?.prevSong).toBe("function");
    expect(typeof result.current?.nextSong).toBe("function");

    // Shared functions
    expect(typeof result.current?.setCurrentContext).toBe("function");
    expect(typeof result.current?.pause).toBe("function");
    expect(typeof result.current?.seek).toBe("function");
    expect(typeof result.current?.setPlayerVolume).toBe("function");
    expect(typeof result.current?.updatePlayerState).toBe("function");
    expect(typeof result.current?.resetVisualProgress).toBe("function");
    expect(typeof result.current?.resetActualProgress).toBe("function");
  });
});