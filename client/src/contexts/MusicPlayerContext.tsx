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
  togglePlay: () => void;
  progress: number;
  setProgress: (progress: number) => void;
}

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // On page load, there is no song to play yet.
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
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
  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current.togglePlay();
      setIsPlaying(!isPlaying);
    }
  };

  // Queues the current song to play.
  async function playSelectedSong() {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Play the song specified by the URI when play is pressed.
      console.log("device id", deviceId);

      const play_song_req_body = {
        device_id: deviceId,
        uris: [currentTrack?.uri],
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

  // When current track changes, make API call to start playback with this new song.
  useEffect(() => {
    // Only start playing music when the player exists and is ready
    if (playerRef.current && isReady) {
      playSelectedSong();
      setIsPlaying(true);
      // playerRef.current.pause();
      // console.log("Paused!")
    }
  }, [currentTrack]);






  
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
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, currentTrack, setCurrentTrack, isPlaying, setIsPlaying, togglePlay, progress, setProgress}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
