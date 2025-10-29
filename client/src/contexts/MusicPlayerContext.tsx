import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import type { Song } from "../components/Music/SongSelection";
import useInterval from "../hooks/useInterval";
import type { SongsAndDates } from "../components/Music/GlobalSpotifyPlayer";

type MusicPlayerContextType = {
  playerRef: React.RefObject<Spotify.Player | null>,
  deviceId: string | null;
  isReady: boolean;
  isPlaying: boolean;
  setIsPlaying:(playing: boolean) => void;
  togglePlay: (song?: Song | null, context?: null) => Promise<void>;
  progress: number;
  setProgress: (progress: number) => void;
  resetProgress: (playerType: PlayerType) => Promise<void>;
  trackToPlay: Song | null;
  setTrackToPlay: (song: Song | null) => void;
  isLoadingSong: boolean;
  pause: () => Promise<void>;
  currentContext: Song | null;
  seek: (timeToSeekTo: number, playerSeeking: PlayerType) => Promise<void>; 
  isScrubbingProgress: RefObject<boolean>;
  setPlayerVolume: (newVolume: number) => Promise<void>;
  volume: number,
  togglePlayGlobal: (monthSongUris: string[], currSongPos?: number) => Promise<void>;
  queueAndPlaySongs: (monthSongUris: string[], startSongPos: number) => Promise<void>;
  getCurrSong: () => Promise<Spotify.Track | null>;
  currentSong: Spotify.Track | null;
  playerModeRef: RefObject<PlayerType | null>;
  isPlayingGlobal: boolean;
  setIsPlayingGlobal: (isPlayingGlobal: boolean) => void;
  progressGlobal: number;
  setProgressGlobal: (progressGlobal: number) => void;
  isLoadingSongGlobal: boolean;
  setIsLoadingSongGlobal: (isLoadingSongGlobal: boolean) => void;
  isScrubbingProgressGlobal: RefObject<boolean>;
  prevSong: () => Promise<void>;
  nextSong: () => Promise<void>;
  determineSongPosition: () => Promise<number | null>;
  setCurrentContext: (context: Song | null) => void;
  previouslyPlayedModeRef: RefObject<PlayerType | null>; 
}

type PlayerType = "calendar" | "entry";

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // On page load, there is no song to play yet.

  // Creates and connects a single global music player once when loading the Provider.
  const { playerRef, deviceId, isReady, currentSong } = useSpotifyPlayer(); // currentSong is for global player to remember which song it is currently playing/paused on
  // Indicates whether the entry player or calendar player is currently "active".
  const playerModeRef = useRef<PlayerType | null>(null);
  // Last mode where the play button was pressed.
  const previouslyPlayedModeRef = useRef<PlayerType | null>(null);
  
  // For entry music players:
  // The song user wants to play
  const [trackToPlay, setTrackToPlay] = useState<Song | null>(null);
  // What is currently loaded in the music player
  const [currentContext, setCurrentContext] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  // To indicate loading state while Spotify queues up the song to play.
  // Initially false because no song being loaded.
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const isScrubbingProgress = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening
  // The visual progress, which differs from the actual progress of the song, because it has to stay the same when a song is being resumed (being reloaded and seeking to the position it was last at) after switching from the calendar player.
  const [visualProgress, setVisualProgress] = useState<number>(progress); 
  
  // For calendar music player:
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);
  const [progressGlobal, setProgressGlobal] = useState(0);
  // To indicate loading state while Spotify queues up the song to play.
  // Initially false because no song being loaded.
  const [isLoadingSongGlobal, setIsLoadingSongGlobal] = useState(false);
  const isScrubbingProgressGlobal = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening (for the calendar player)

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


  /**************************
   * Entry Player Functions *
   **************************/

  // console.log("prev played mode", previouslyPlayedMode);
  // console.log("curr mode", playerMode)

  // Toggles music playing (but more...).
  // Note: only pass in song for queuedSong to queue up song; otherwise, default to passing in nothing (pausing/resuming)
  // Note: only pass in null for playerContext to queue up song; otherwise, default to passing in nothing
  // Note: passing in nothing for both params = pausing/resuming song playing
  // playerContext = song
  const togglePlay = async (queuedSong? : Song | null, playerContext? : null) => {
    // console.log("track to play:", trackToPlay?.title);
    // console.log("current context:", currentContext?.title);

    const songToPlay = queuedSong ?? trackToPlay;

    let context;

    if (playerContext === undefined) {
      context = currentContext;
    } else {
      context = null;
    }

    if (playerRef.current) {
      // The very first song played (for the very first time) upon music player being ready.
      if (songToPlay && !context) {
        // Save this song as the new context.
        setCurrentContext(songToPlay);

        // Play the song.
        await playSong(songToPlay); // can't pass currentContext here b/c the state doesn't update immediately (React things...)
        setIsPlaying(true);
        setIsLoadingSong(false);

        console.log("am here 1")
      } else if (songToPlay && context) {
        // For songs after the first play.
        
        console.log("progress should not be 0:", progress)
        console.log("prev played mode", previouslyPlayedModeRef)
        console.log("is prev mode calendar", previouslyPlayedModeRef.current === "calendar")
        console.log("is progress > 0", progress > 0)
        
        // The user wants to resume/pause playing the same song.
        if (songToPlay.uri === context.uri && previouslyPlayedModeRef.current !== "calendar") {
          console.log("am here 2")
          console.log("context", context);
          // Pause/resume music playing.
          await playerRef.current.togglePlay();
          setIsPlaying(!isPlaying);
        } else {
          // Note: unfortunately, when switching between calendar and entry players, there's really no good way to resume the entry player where it was paused, so I'm deciding to just reload the song to restart the progress all together.

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
  
  // Queues the current song to play.
  async function playSong(songToPlay: Song) {
    // console.log("song being queued", songToPlay.title);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Play the song specified by the URI when play is pressed.
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


  /***************************
   * Global Player Functions *
   ***************************/
  // currSongPos = where to start in the playlist
  async function togglePlayGlobal(monthSongUris: string[], currSongPos = 0) {
    console.log("prev mode", previouslyPlayedModeRef.current);
    console.log("curr mode", playerModeRef.current);
    if (playerRef.current) {
      // If switching from entry to calendar player, requeue the songs for the calendar player and start playing the song the calendar last played.
      if (previouslyPlayedModeRef.current === "entry") {
        await queueAndPlaySongs(monthSongUris, currSongPos);
      } else {
        // Otherwise, continue playing/pausing.
        setIsPlayingGlobal(!isPlayingGlobal);
        await playerRef.current.togglePlay();
      }
    }
  }

  // For global player only (queue and play songs for the month selected)
  async function queueAndPlaySongs(monthSongUris: string[], startSongPos: number) {
    setIsLoadingSongGlobal(true);
    // Request API to queue up month's songs.
    const apiUrl = import.meta.env.VITE_API_URL;

    const reqBody = {
      device_id: deviceId,
      uris: monthSongUris,
      // offset: {
      //   uri: monthSongUris[startSongPos],
      // },
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
        setIsLoadingSongGlobal(false);
        resetProgress("calendar");
        // await playerRef.current.resume();
        setIsPlayingGlobal(true);
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

  async function prevSong() {
    if (playerRef.current) {
      await resetProgress("calendar");
      await playerRef.current.previousTrack();
      setIsPlayingGlobal(true);
    }
  }

  async function nextSong() {
    if (playerRef.current) {
      await resetProgress("calendar");
      await playerRef.current.nextTrack();
      setIsPlayingGlobal(true);
    }
  }

  // Index (0-based)
  async function determineSongPosition() {
    if (playerRef.current) {
      const state = await playerRef.current.getCurrentState();

      // const currSong = state?.track_window.current_track;
      // const nextSongs = state?.track_window.next_tracks;
      if (state) {
        const prevSongs = state.track_window.previous_tracks;
        // console.log("prev songs length", prevSongs.length);
        // console.log(prevSongs.map((song) => song.name))
        return prevSongs.length;
      }
    }

    return null; // ? or undefined?
  }

  /***************************
   * Shared Player Functions *
   ***************************/

  async function pause() {
    if (playerRef.current) {
      await playerRef.current.pause();
      if (playerModeRef.current === "entry") {
        setIsPlaying(false);
      } else {
        setIsPlayingGlobal(false);
      }
    }
  }

  // time (in ms); playerSeeking = the player trying to seek
  async function seek(timeToSeekTo: number, playerSeeking: PlayerType) {
    // Only seek if the player seeking is the one "active".
    if (playerModeRef.current === playerSeeking) {
      if (playerRef.current) {
        await playerRef.current.seek(timeToSeekTo);
      }
    }
  }



  
  
  
  
  // Resets progress of music playing.
  async function resetProgress(playerType: PlayerType) {
    // Reset visual progress.
    if (playerType === "entry") {
      setProgress(0);
    } else {
      console.log("RESETTING");
      setProgressGlobal(0);
    }
    
    // Reset the actual progress of the song.
    if (playerRef.current) {
      // THIS WAS THE CAUSE OF THE DAMNED BUG!! DO NOT UNCOMMENT. DELETE SOON PLS!!
      // await playerRef.current.seek(0);
    }
  };
  



  // NOT UPDATED YET <CHECKPT>



  // Update the progress of the song being played every second.
  useInterval(() => {
    if (playerModeRef.current === "entry") {
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
    } else {
      // Don't update the progress state while scrubbing is happening. (Otherwise, it'll be jumpy)
      if (isScrubbingProgressGlobal.current) {
        return;
      }
  
      // Otherwise, update the progress.
      playerRef.current?.getCurrentState().then((state) => {
        setProgressGlobal(state!.position);
  
        // Stop playing once the song ends.
        if (state!.position === 0) {
          setIsPlayingGlobal(false);
        }
      })
    }
  }, (isPlaying || isPlayingGlobal) && playerRef.current && isReady && !isLoadingSong && (currentContext || playerModeRef.current === "calendar") ? 1000 : null); // may have to change `mode === "calendar"` part of condition to be more specifically when calendar player has a current song loaded up/shown

  // console.log("mode", playerMode);

  const [volume, setVolume] = useState(1);

  async function setPlayerVolume(newVolume: number) {
    if (playerRef.current) {
      await playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  }

  return (
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, /*currentTrack, setCurrentTrack,*/ isPlaying, setIsPlaying, togglePlay, progress, setProgress, resetProgress, trackToPlay, setTrackToPlay, isLoadingSong, pause, currentContext, seek, isScrubbingProgress, setPlayerVolume, volume, togglePlayGlobal, queueAndPlaySongs, getCurrSong, currentSong, playerModeRef, isPlayingGlobal, setIsPlayingGlobal, progressGlobal, setProgressGlobal, isLoadingSongGlobal, setIsLoadingSongGlobal, isScrubbingProgressGlobal, prevSong, nextSong, determineSongPosition, setCurrentContext, previouslyPlayedModeRef}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
