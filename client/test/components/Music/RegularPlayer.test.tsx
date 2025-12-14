import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { defaultMusicPlayerVal, MusicPlayerRenderOptions, renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import RegularPlayer from "../../../src/components/Music/RegularPlayer";
import { Song } from "../../../src/components/Music/SongSelection";

describe("RegularPlayer", () => {
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

  const mockSong: Song = {
    id: "123",
    uri: "uri",
    album: "my album",
    albumCoverUrls: ["url1", "url2", "url3"],
    title: "my song",
    artists: "me",
    durationMS: 180000
  };

  const mockSetIsSearching = vi.fn();
  const mockSetSongToPlay = vi.fn();

  it("renders empty album cover when no song is selected", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={null}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const albumCoverDiv = screen.getByTestId("album-cover-wrapper-reg-player");

    expect(albumCoverDiv).toBeInTheDocument();
  });

  it("displays song information when song is selected", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    expect(screen.getByText("my song")).toBeInTheDocument();
    expect(screen.getByText("me")).toBeInTheDocument();
  });

  it("displays album cover when song is selected", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const albumCover = screen.getByAltText(/cover of the album my album/i);
    expect(albumCover).toBeInTheDocument();
    expect(albumCover).toHaveAttribute("src", "url3");
  });

  it("shows empty song title and artist when no song is selected", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={null}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const songTitle = screen.getByTestId("title-reg-player");
    const songArtist = screen.getByTestId("artist-reg-player");

    expect(songTitle).toBeInTheDocument();
    expect(songTitle).toHaveTextContent("");

    expect(songArtist).toBeInTheDocument();
    expect(songArtist).toHaveTextContent("");
  });

  it("renders play/pause button", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: true,
        isLoadingSong: false,
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const playPauseBtn = screen.getByTestId("play-pause-btn-reg-player");
    expect(playPauseBtn).toBeInTheDocument();
  });

  it("play/pause button is disabled when music player is not ready", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: false,
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    // When not ready, should show loader instead of button.
    const loader = screen.getByTestId("reg-player-loader");
    expect(loader).toBeInTheDocument();
  });

  it("shows loading spinner when music player is loading a song", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: true,
        isLoadingSong: true,
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const loader = screen.getByTestId("reg-player-loader");
    expect(loader).toBeInTheDocument();
  });

  it("renders progress bar", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toBeInTheDocument();
  });

  it("progress bar is disabled when player mode is calendar", () => {
    const musicPlayerContextVal: MusicPlayerRenderOptions = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        playerModeRef: { current: "calendar" },
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toBeDisabled();
  });

  it("progress bar is disabled when player mode is null", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        playerModeRef: { current: null },
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toBeDisabled();
  });

  it("renders volume bar on non-mobile devices", () => {
    mockIsMobileDevice.mockReturnValue(false);

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const volumeBar = screen.getByTestId("volume-bar");
    expect(volumeBar).toBeInTheDocument();
  });

  it("doesn't render volume bar on mobile devices", () => {
    mockIsMobileDevice.mockReturnValue(true);

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const volumeBar = screen.queryByTestId("volume-bar");
    expect(volumeBar).not.toBeInTheDocument();
  });

  it("volume bar is disabled when player mode is calendar", () => {
    const musicPlayerContextVal: MusicPlayerRenderOptions = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        playerModeRef: { current: "calendar" },
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const volumeBar = screen.getByTestId("volume-bar");
    expect(volumeBar).toBeDisabled();
  });

  it("volume bar is disabled when player mode is null", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        playerModeRef: { current: null },
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const volumeBar = screen.getByTestId("volume-bar");
    expect(volumeBar).toBeDisabled();
  });

  it("doesn't show Change Song button when not editing", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={true}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const changeSongBtn = screen.queryByRole("button", { name: /change song/i });
    expect(changeSongBtn).not.toBeInTheDocument();
  });

  it("doesn't show Change Song button when Add Song button is not active", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={true}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const changeSongBtn = screen.queryByRole("button", { name: /change song/i });
    expect(changeSongBtn).not.toBeInTheDocument();
  });

  it("shows Change Song button when editing and Add Song button is active", () => {
    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={true}
        isAddSongBtnActive={true}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const changeSongBtn = screen.getByRole("button", { name: /change song/i });
    expect(changeSongBtn).toBeInTheDocument();
  });

  it("calls setIsSearching and setSongToPlay when Change Song button is clicked", async () => {
    const mockSetIsSearching = vi.fn();
    const mockSetSongToPlay = vi.fn();

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={true}
        isAddSongBtnActive={true}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />
    );

    const changeSongBtn = screen.getByRole("button", { name: /change song/i });
    await userEvent.click(changeSongBtn);

    expect(mockSetIsSearching).toHaveBeenCalledWith(true);
    expect(mockSetSongToPlay).toHaveBeenCalledWith(mockSong);
  });

  it("shows play icon when music is not playing", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: true,
        isLoadingSong: false,
        isPlaying: false,
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const playIcon = screen.getByTestId("play-icon-reg-player");
    
    expect(playIcon).toBeInTheDocument();
  });

  it("shows pause icon when music is playing", () => {
    const musicPlayerContextVal = {
      musicPlayerValue: {
        ...defaultMusicPlayerVal,
        isReady: true,
        isLoadingSong: false,
        isPlaying: true,
      }
    };

    renderWithMusicPlayer(
      <RegularPlayer
        songSelection={mockSong}
        isEditing={false}
        isAddSongBtnActive={false}
        setIsSearching={mockSetIsSearching}
        setSongToPlay={mockSetSongToPlay}
      />,
      musicPlayerContextVal
    );

    const pauseIcon = screen.getByTestId("pause-icon-reg-player");
    
    expect(pauseIcon).toBeInTheDocument();
  });
});