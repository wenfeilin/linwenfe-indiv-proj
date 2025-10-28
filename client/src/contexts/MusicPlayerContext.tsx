import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import type { Song } from "../components/Music/SongSelection";
import useInterval from "../hooks/useInterval";

type MusicPlayerContextType = {
  playerRef: React.RefObject<Spotify.Player | null>,
  deviceId: string | null;
  isReady: boolean;
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
  currentContext: Song | null;
  seek: (timeToSeekTo: number) => Promise<void>; 
  isScrubbingProgress: RefObject<boolean>;
  setPlayerVolume: (newVolume: number) => Promise<void>;
  volume: number,
  togglePlayGlobal: () => Promise<void>;
  queueAndPlaySongs: (monthSongUris: string[]) => Promise<void>;
  getCurrSong: () => Promise<Spotify.Track | null>;
  currentSong: Spotify.Track | null;
  playerMode: "calendar" | "entry";
  setPlayerMode: (mode: "calendar" | "entry") => void;
}

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // On page load, there is no song to play yet.
  // const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  // const [searchedTrackToPlay, setSearchedTrackToPlay] = useState<Song | null>(null);

  // For entry music players.
  // The song user wants to play
  const [trackToPlay, setTrackToPlay] = useState<Song | null>(null);
  // What is currently loaded in the music player
  const [currentContext, setCurrentContext] = useState<Song | null>(null);

  // To indicate loading state while Spotify queues up the song to play.
  // Initially false because no song being loaded.
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  // Indicates whether the entry player or calendar player is currently "active".
  const [playerMode, setPlayerMode] = useState<"calendar" | "entry">("calendar");


  // console.log("Context's current song is", currentTrack?.title);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Creates and connects a single global music player once when loading the Provider.
  const { playerRef, deviceId, isReady, currentSong } = useSpotifyPlayer();

  // Run once (on mount).
  // Note: Should prob move this to useSpotifyPlayer.ts as an unmount fxn since it has to do w/ disconnecting.
  useEffect(() => {
    // const getPlayerVolume = async () => {
    //   if (playerRef.current) {
    //     const currVolume = await playerRef.current.getVolume();
    //     setVolume(currVolume);
    //   }
    // }
    
    // getPlayerVolume();

    // Disconnects the music player on unmount. (cleanup function that runs on app unmount since the Provider is the first direct child of the App component -- that means when the app gets reloaded or the tab/window is closed. 

    // Note: if the app is navigated away from (navigate to another tab/window), the App is not unmounted, so the player is still connected. This may or may not be undesirable. If you want to change it, use a visibility change event listener that can determine if the website loses focus.
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    }
  }, []);

  // Toggles music playing (but more...).
  // Note: only pass in song for queuedSong to queue up song; otherwise, default to passing in nothing (pausing/resuming)
  // Note: only pass in null for playerContext to queue up song; otherwise, default to passing in nothing
  // Note: passing in nothing for both params = pausing/resuming song playing
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

  // for global player only
  async function togglePlayGlobal() {
    if (playerRef.current) {
      setIsPlaying(!isPlaying);
      await playerRef.current.togglePlay();
    }
  }

  // For global player only (queue and play songs for the month selected)
  async function queueAndPlaySongs(monthSongUris: string[]) {
    setIsLoadingSong(true);
    // Request API to queue up month's songs.
    const apiUrl = import.meta.env.VITE_API_URL;

    const reqBody = {
      device_id: deviceId,
      uris: monthSongUris,
    };

    try {
      await fetch(`${apiUrl}/player/play`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
        credentials: "include",
      });

      if (playerRef.current) {
        setIsLoadingSong(false);
        await playerRef.current.resume();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // mainly for the global music player
  async function getCurrSong() {
    if (playerRef.current) {
      const state = await playerRef.current?.getCurrentState();
      return state?.track_window.current_track ?? null;
    }

    return null;
  }

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

  // time (in ms)
  async function seek(timeToSeekTo: number) {
    if (playerRef.current) {
      await playerRef.current.seek(timeToSeekTo);
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

  const isScrubbingProgress = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening 

  // Update the progress of the song being played every second.
  useInterval(() => {
    // Don't update the progress state while scrubbing is happening. (Otherwise, it'll be jumpy)
    if (isScrubbingProgress.current) {
      return;
    }

    // Otherwise, update the progress.
    playerRef.current?.getCurrentState().then((state) => {
      setProgress(state!.position);

      // Stop playing once the song ends.
      if (state!.position === 0) {
        setIsPlaying(false);
      }
    })
  }, isPlaying && playerRef.current && isReady && !isLoadingSong && (currentContext || playerMode === "calendar") ? 1000 : null);

  const [volume, setVolume] = useState(1);

  async function setPlayerVolume(newVolume: number) {
    if (playerRef.current) {
      await playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  }

  return (
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, /*currentTrack, setCurrentTrack,*/ isPlaying, setIsPlaying, togglePlay, progress, setProgress, resetProgress, trackToPlay, setTrackToPlay, isLoadingSong, pause, currentContext, seek, isScrubbingProgress, setPlayerVolume, volume, togglePlayGlobal, queueAndPlaySongs, getCurrSong, currentSong, playerMode, setPlayerMode}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
