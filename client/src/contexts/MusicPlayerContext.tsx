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
  togglePlay: (song?: Song | null, context?: null) => Promise<void>;
  progress: number;
  setProgress: (progress: number) => void;
  resetProgress: () => Promise<void>;
  trackToPlay: Song | null;
  setTrackToPlay: (song: Song | null) => void;
  isLoadingSong: boolean;
  pause: () => Promise<void>;
}

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // On page load, there is no song to play yet.
  // GET RID OF THESE LATER -- BEING REPLACED BY trackToPlay and currentContext prob.
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [searchedTrackToPlay, setSearchedTrackToPlay] = useState<Song | null>(null);

  // The song user wants to play
  const [trackToPlay, setTrackToPlay] = useState<Song | null>(null);
  // What is currently loaded in the music player
  const [currentContext, setCurrentContext] = useState<Song | null>(null);

  // To indicate loading state while Spotify queues up the song to play.
  // Initially false because no song being loaded.
  const [isLoadingSong, setIsLoadingSong] = useState(false);


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

  // Toggles music playing (but more...).
  // Note: only pass in song for queuedSong to queue up song; otherwise, default to passing in nothing (pausing/resuming)
  // Note: only pass in null for playerContext to queue up song; otherwise, default to passing in nothing
  const togglePlay = async (queuedSong? : Song | null, playerContext? : null) => {
    console.log("track to play:", trackToPlay?.title);
    console.log("current context:", currentContext?.title);

    const songToPlay = queuedSong ?? trackToPlay;

    let context;

    if (playerContext === undefined) {
      context = currentContext;
    } else {
      context = null;
    }

    if (playerRef.current) {
      // The very first song played upon music player being ready.
      if (songToPlay && !context) {
        // Save this song as the new context.
        setCurrentContext(songToPlay);

        // Play the song.
        await playSong(songToPlay); // can't pass currentContext here b/c the state doesn't update immediately (React things...)
        setIsPlaying(true);
        setIsLoadingSong(false);
      } else if (songToPlay && context) {
        // For songs after the first song played.
        
        // The user wants to resume/pause playing the same song.
        console.log("are the track and context the same?", songToPlay.uri === context.uri);
        if (songToPlay.uri === context.uri) {
          // Pause/resume music playing.
          await playerRef.current.togglePlay();
          setIsPlaying(!isPlaying);
        } else {
          // The user wants to play a new song.
          setIsLoadingSong(true);

          // Save new context.
          setCurrentContext(songToPlay);

          // Play the new song.
          await playSong(songToPlay);
          setIsPlaying(true);
          setIsLoadingSong(false);
        }
      }
    }
  };

  async function pause() {
    if (playerRef.current) {
      await playerRef.current.pause();
      setIsPlaying(false);
    }
  }

  // Queues the current song to play.
  async function playSong(songToPlay: Song) {
    console.log("song being queued", songToPlay.title);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Play the song specified by the URI when play is pressed.
      console.log("device id", deviceId);

      const play_song_req_body = {
        device_id: deviceId,
        uris: [songToPlay.uri],
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

  // Resets progress of music playing.
  const resetProgress = async () => {
    // Reset visual progress.
    setProgress(0);

    // Reset the actual progress of the song.
    if (playerRef.current) {
      await playerRef.current.seek(0);
    }
    console.log("is playing", isPlaying)
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
  }, isPlaying && playerRef.current && isReady && !isLoadingSong && currentContext ? 1000 : null);

  return (
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, currentTrack, setCurrentTrack, isPlaying, setIsPlaying, togglePlay, progress, setProgress, resetProgress, trackToPlay, setTrackToPlay, isLoadingSong, pause}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
