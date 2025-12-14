import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { defaultMusicPlayerVal, MusicPlayerRenderOptions, renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import MiniSpotifyPlayer from "../../../src/components/Music/MiniSpotifyPlayer";

describe("MiniSpotifyPlayer", () => {
  vi.mock("react-loader-spinner", () => ({
    ColorRing: () => (
      <div data-testid="mini-player-loader"> Loading...</div>
    )
  }));

  const mockIsMobileDevice = vi.hoisted(() => vi.fn()); // vi.hoisted() to make sure the mock is available for vi.mock()

  vi.mock("../../../src/utils/device", () => ({
    isMobileDevice: () => mockIsMobileDevice()
  }));

  beforeEach(() => {
    mockIsMobileDevice.mockReturnValue(false); // default = non-mobile device
  });
  
  const noTrackToPlay = null;
  
  it("disables elements when there's no track to play", () => {
    renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={noTrackToPlay} />);

    const albumCover = screen.queryByRole("img");
    const albumCoverWrapper = screen.getByTestId("album-cover-wrapper");
    const songTitle = screen.queryByTestId("mini-player-song-title");
    const songArtist = screen.queryByTestId("mini-player-song-artist");

    expect(albumCover).toBe(null);
    expect(albumCoverWrapper).toHaveClass("bg-gray-100");
    expect(songTitle).toHaveTextContent("");
    expect(songArtist).toHaveTextContent("");
  });

  describe("shows loading when music player is loading or isn't ready", () => {
    it("shows loading when music player isn't ready", () => {
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          isReady: false,
        }
      }
  
      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={noTrackToPlay} />, musicPlayerContextVal);
  
      const loader = screen.getByTestId("mini-player-loader");
      expect(loader).toBeInTheDocument();    
    });

    it("shows loading when music player is loading", () => {
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          isLoadingSong: true,
        }
      }
  
      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={noTrackToPlay} />, musicPlayerContextVal);
  
      const loader = screen.getByTestId("mini-player-loader");
      expect(loader).toBeInTheDocument();    
    });
  });
  
  const currTrackToPlay = {
    id: "123",
    uri: "uri",
    album: "my album",
    albumCoverUrls: [
      "cover1",
      "cover2",
      "cover3"
    ],
    title: "my song",
    artists: "me",
    durationMS: 1000,
  };

  it("populates elements with appropriate details when there is a track to play", () => {
    renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />);

    const albumCover = screen.getByRole("img");
    const albumCoverWrapper = screen.getByTestId("album-cover-wrapper");
    const songTitle = screen.getByTestId("mini-player-song-title");
    const songArtist = screen.getByTestId("mini-player-song-artist");

    expect(albumCover).toBeInTheDocument();
    expect(albumCoverWrapper).not.toHaveClass("bg-gray-100");
    expect(songTitle).toBeInTheDocument();
    expect(songArtist).toBeInTheDocument();
  });

  describe("when music player is ready and not loading a song", () => {
    it("renders pause button when music is playing", () => {
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          isPlaying: true,
        }
      };

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);

      const pauseBtn = screen.getByRole("button");
      const pauseIcon = pauseBtn.querySelector("svg");
      
      expect(pauseBtn).toBeInTheDocument();
      expect(pauseIcon).toBeInTheDocument();
    });

    it("renders play button when music is not playing", () => {

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />);

      const playBtn = screen.getByRole("button");
      const playIcon = playBtn.querySelector("svg");
      
      expect(playBtn).toBeInTheDocument();
      expect(playIcon).toBeInTheDocument();
    });
  });

  describe("play/pause button interaction", () => {
    it("calls updatePlayerState with entry and togglePlay when clicked", async () => {
      const mockUpdatePlayerState = vi.fn();
      const mockTogglePlay = vi.fn();

      // Pass mocked fxn into the context (b/c no way to extract them otherwise)
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          updatePlayerState: mockUpdatePlayerState,
          togglePlay: mockTogglePlay,
        }
      };

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);

      const playBtn = screen.getByRole("button");
      await userEvent.click(playBtn);

      expect(mockUpdatePlayerState).toHaveBeenCalledWith("entry");
      expect(mockTogglePlay).toHaveBeenCalled();
    });
  });

  describe("progress bar state", () => {
    it("is disabled when player mode is calendar", () => {
      const musicPlayerContextVal: MusicPlayerRenderOptions = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          playerModeRef: { current: "calendar" },
        }
      };

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);

      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar).toBeDisabled();
    });

    it("is disabled when player mode is null", () => {
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          playerModeRef: { current: null },
        }
      };

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);

      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar).toBeDisabled();
    });
  });

  describe("volume bar state", () => {
    it("is rendered on non-mobile devices", () => {
      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />);

      const volumeBar = screen.getByTestId("volume-bar");
      expect(volumeBar).toBeInTheDocument();
    });
    
    it("is disabled when player mode is calendar", () => {
      const musicPlayerContextVal: MusicPlayerRenderOptions = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          playerModeRef: { current: "calendar" },
        }
      };
      
      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);
      
      const volumeBar = screen.getByTestId("volume-bar");
      expect(volumeBar).toBeDisabled();
    });
    
    it("is disabled when player mode is null", () => {
      const musicPlayerContextVal = {
        musicPlayerValue: {
          ...defaultMusicPlayerVal,
          playerModeRef: { current: null },
        }
      };
      
      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />, musicPlayerContextVal);
      
      const volumeBar = screen.getByTestId("volume-bar");
      expect(volumeBar).toBeDisabled();
    });

    
    it("is not rendered on mobile devices", () => {
      mockIsMobileDevice.mockReturnValue(true); // on mobile device

      renderWithMusicPlayer(<MiniSpotifyPlayer currentTrackToPlay={currTrackToPlay} />);

      const volumeBar = screen.queryByTestId("volume-bar");
      expect(volumeBar).toBe(null);
    });
  });
});