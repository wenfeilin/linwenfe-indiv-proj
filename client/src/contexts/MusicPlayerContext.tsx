import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import type { Song } from "../components/Music/SongSelection";
import useInterval from "../hooks/useInterval";

type MusicPlayerContextType = {
  playerRef: React.RefObject<Spotify.Player | null>,
  deviceId: string | null;
  isReady: boolean;
  currentTrack: Song | null;
  setCurrentTrack: (song: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying:(playing: boolean) => void;
  togglePlay: () => Promise<void>;
  progress: number;
  setProgress: (progress: number) => void;
  resetProgress: () => void;
  pause: () => Promise<void>;
}

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // On page load, there is no song to play yet.
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [searchedTrackToPlay, setSearchedTrackToPlay] = useState<Song | null>(null);
  // console.log("Context's current song is", currentTrack?.title);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Creates and connects a music player.
  const { playerRef, deviceId, isReady } = useSpotifyPlayer();

  useEffect(() => {
    // Disconnects the music player on unmount. (cleanup function that runs on unmount)
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    }
  }, []);

  // Toggles music playing.
  const togglePlay = async () => {
    if (playerRef.current) {
      await playerRef.current.togglePlay();
      setIsPlaying(!isPlaying);
    }
  };

  // Pause music.
  const pause = async () => {
    if (playerRef.current) {
      await playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Queues the current song to play.
  async function playSelectedSong(songToPlay: Song | null) {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Play the song specified by the URI when play is pressed.
      console.log("device id", deviceId);

      const play_song_req_body = {
        device_id: deviceId,
        uris: [songToPlay?.uri],
      };

      await fetch(`${apiUrl}/player/play`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(play_song_req_body),
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }
  }

  // should also load song when play is pressed if there is already a song selection for the entry.

  // When current track changes, make API call to start playback with this new song (queue it up immediately).
  useEffect(() => {
    // Only start playing music when the player exists and is ready
    if (playerRef.current && isReady) {
      playSelectedSong(currentTrack);
      setIsPlaying(true);
      // pause();
      // togglePlay();
      // playerRef.current.pause();
      // console.log("Paused!")
    }
  }, [currentTrack]);

  // When a searched track being queued to play changes, make API call to start playback with this new song (queue it up immediately).
  useEffect(() => {
    // Only start playing music when the player exists and is ready
    if (playerRef.current && isReady && searchedTrackToPlay) {
      console.log("searched track", searchedTrackToPlay)
      
      playSelectedSong(searchedTrackToPlay);
      setIsPlaying(true);
      // togglePlay();
      // playerRef.current.pause();
      // console.log("Paused!")
    }
  }, [searchedTrackToPlay]);

  // Resets progress of music playing.
  const resetProgress = () => {
    // Reset visual progress.
    setProgress(0);

    // Reset the actual progress of the song.
    if (playerRef.current) {
      playerRef.current.seek(0);
    }
  };


  
  // Update the progress of the song being played every second.
  useInterval(() => {
    playerRef.current?.getCurrentState().then((state) => {
      setProgress(state!.position);

      // Stop playing once the song ends.
      if (state!.position === 0) {
        setIsPlaying(false);
      }
    })
  }, isPlaying && playerRef.current && isReady && currentTrack ? 1000 : null);

  return (
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, currentTrack, setCurrentTrack, isPlaying, setIsPlaying, togglePlay, progress, setProgress, resetProgress, pause}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
