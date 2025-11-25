import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import type { Song } from "../components/Music/SongSelection";
import useInterval from "../hooks/useInterval";
import type { SongsAndDates } from "../components/Music/GlobalSpotifyPlayer";
import type MusicPlayer from "../interfaces/musicPlayer";

type MusicPlayerContextType = {
  playerRef: React.RefObject<Spotify.Player | null>,
  deviceId: string | null;
  isReady: boolean; // used
  isPlaying: boolean; // used
  setIsPlaying:(playing: boolean) => void; 
  togglePlay: (song?: Song | null, context?: null) => Promise<void>; // used
  progress: number; // used
  setProgress: (progress: number) => void;
  resetProgress: (playerType: PlayerType) => void; 
  trackToPlay: Song | null; // NEED!!! ???
  setTrackToPlay: (song: Song | null) => void;
  isLoadingSong: boolean;
  pause: () => Promise<void>; // used
  currentContext: Song | null;
  seek: (timeToSeekTo: number, playerSeeking: PlayerType) => Promise<void>; // used
  isScrubbingProgress: RefObject<boolean>;
  setPlayerVolume: (newVolume: number) => Promise<void>; // used
  volume: number, // used
  togglePlayGlobal: (monthSongUris: string[], currSongPos?: number) => Promise<void>;
  queueAndPlaySongs: (monthSongUris: string[], startSongPos: number) => Promise<void>;
  getCurrSong: () => Promise<Spotify.Track | null>;
  currentSong: Spotify.Track | null; // used (but slightly diff type)
  playerModeRef: RefObject<PlayerType | null>;
  isPlayingGlobal: boolean;
  setIsPlayingGlobal: (isPlayingGlobal: boolean) => void;
  progressGlobal: number;
  setProgressGlobal: (progressGlobal: number) => void;
  isLoadingSongGlobal: boolean;
  setIsLoadingSongGlobal: (isLoadingSongGlobal: boolean) => void;
  isScrubbingProgressGlobal: RefObject<boolean>;
  prevSong: () => Promise<void>; // used
  nextSong: () => Promise<void>; // used
  determineSongPosition: () => Promise<number | null>;
  setCurrentContext: (context: Song | null) => void;
  previouslyPlayedModeRef: RefObject<PlayerType | null>; 
  updatePlayerState: (currMode: PlayerType) => Promise<void>;
  resetActualProgress: () => Promise<void>;
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
  const isResettingRef = useRef(false); // for stopping the useInterval from updating the progress when resetting the entry player
  
  // For calendar music player:
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);
  const [progressGlobal, setProgressGlobal] = useState(0);
  // To indicate loading state while Spotify queues up the song to play.
  // Initially false because no song being loaded.
  const [isLoadingSongGlobal, setIsLoadingSongGlobal] = useState(false);
  const isScrubbingProgressGlobal = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening (for the calendar player)
  const isResettingGlobalRef = useRef(false); // for stopping the useInterval from updating the progress when resetting the entry player


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

        // console.log("am here 1")
      } else if (songToPlay && context) {
        // For songs after the first play.
        
        // console.log("progress should not be 0:", progress)
        // console.log("prev played mode", previouslyPlayedModeRef)
        // console.log("is prev mode calendar", previouslyPlayedModeRef.current === "calendar")
        // console.log("is progress > 0", progress > 0)
        
        // The user wants to resume/pause playing the same song.
        if (songToPlay.uri === context.uri && previouslyPlayedModeRef.current !== "calendar") {
          // console.log("am here 2")
          // console.log("context", context);
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
    // console.log("prev mode", previouslyPlayedModeRef.current);
    // console.log("curr mode", playerModeRef.current);
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
  

  const prevSongUriRef = useRef<string | null>(null);
  const songPositionRef = useRef(-1); // reset to -1 again when START is pressed (new playlist queued)
  const prevOrNextPressed = useRef(false);

  async function prevSong() {
    if (playerRef.current) {
      resetProgress("calendar");
      await playerRef.current.previousTrack();
      setIsPlayingGlobal(true);

      // prevOrNextPressed.current = true;

      const state = await playerRef.current.getCurrentState();

      if (state) {
        console.log(state.track_window.previous_tracks);
        if (state.track_window.previous_tracks.length === 0) {
          await resetActualProgress();
          await playerRef.current.resume();
          setIsPlayingGlobal(true);
        }
      }

      // if (songPositionRef.current === 0) {
      //   await resetActualProgress();
      // }

      // if (songPositionRef.current > 0) {
      //   songPositionRef.current = songPositionRef.current - 2;
      // } 
      
    }
  }

  async function nextSong() {
    if (playerRef.current) {
      resetProgress("calendar");
      await playerRef.current.nextTrack();
      setIsPlayingGlobal(true);

      // const state = await playerRef.current.getCurrentState();
      // prevSongUriRef.current = state!.track_window.current_track.uri;

    }
  }
  
  // if (playerRef.current) {
  //   playerRef.current.addListener('player_state_changed', ({
  //     position,
  //     /*duration,*/
  //     track_window: { current_track }
  //   }) => {
  //     // console.log('Currently Playing', current_track.name);
  //     // console.log('Position in Song', position);
  //     // console.log('Duration of Song', duration);
      
  //     if (isPlayingGlobal && (current_track.uri !== prevSongUriRef.current)) {
  //       prevSongUriRef.current = current_track.uri;

  //       if (songPositionRef.current == /*totalSongs*/12 - 1) {
  //         songPositionRef.current = 0;
  //       } else {
  //         songPositionRef.current++;
  //       }
  //     }
      
  //     console.log(songPositionRef.current);
  //   });

  // }

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
  function resetProgress(playerType: PlayerType) {
    // Reset visual progress.
    if (playerType === "entry") {
      isResettingRef.current = true;
      setProgress(0);
      isResettingRef.current = false;
    } else {
      console.log("RESETTING");
      isResettingGlobalRef.current = true;
      setProgressGlobal(0);
      isResettingGlobalRef.current = false;
    }
    
    // Reset the actual progress of the song.
    if (playerRef.current) {
      // THIS WAS THE CAUSE OF THE DAMNED BUG!! DO NOT UNCOMMENT. DELETE SOON PLS!!
      // await playerRef.current.seek(0);
    }
  }

  async function resetActualProgress() {
    if (playerRef.current) {
      await playerRef.current.seek(0);
    }
  }

  async function updatePlayerState(currMode: PlayerType) {
    // Save the previous mode that the player was in.
    previouslyPlayedModeRef.current = playerModeRef.current;

    // Update the current mode now that a change was made by the user. (User interacting with a player)
    playerModeRef.current = currMode;

    // Reset the other player's progress if needed (so it visually resets).
    if (previouslyPlayedModeRef.current !== currMode) {
      if (currMode === "entry") {
        resetProgress("calendar");
        setIsPlayingGlobal(false);
      } else  {
        resetProgress("entry");
        setIsPlaying(false);
      }
    }
  }

  



  // NOT UPDATED YET <CHECKPT>



  // Update the progress of the song being played every second.
  useInterval(() => {
    if (playerModeRef.current === "entry") {
      // Don't update the progress state while scrubbing is happening or while the entry player is resetting its (visual) progress. (Otherwise, it'll be jumpy)
      if (isScrubbingProgress.current || isResettingRef.current) {
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
      // Don't update the progress state while scrubbing is happening or while the calendar player is resetting its (visual) progress. (Otherwise, it'll be jumpy)
      if (isScrubbingProgressGlobal.current || isResettingGlobalRef.current) {
        console.log(isResettingGlobalRef.current)
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
  }, (isPlaying || isPlayingGlobal) && playerRef.current && isReady && (!isLoadingSong || !isLoadingSongGlobal) && (currentContext || playerModeRef.current === "calendar") ? 1000 : null); // may have to change `mode === "calendar"` part of condition to be more specifically when calendar player has a current song loaded up/shown

  // console.log("mode", playerMode);

  const [volume, setVolume] = useState(1); // Initial value of volume is 1 (out of 1).

  async function setPlayerVolume(newVolume: number) {
    if (playerRef.current) {
      await playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  }

  return (
    <MusicPlayerContext.Provider value={{playerRef, deviceId, isReady, /*currentTrack, setCurrentTrack,*/ isPlaying, setIsPlaying, togglePlay, progress, setProgress, resetProgress, trackToPlay, setTrackToPlay, isLoadingSong, pause, currentContext, seek, isScrubbingProgress, setPlayerVolume, volume, togglePlayGlobal, queueAndPlaySongs, getCurrSong, currentSong, playerModeRef, isPlayingGlobal, setIsPlayingGlobal, progressGlobal, setProgressGlobal, isLoadingSongGlobal, setIsLoadingSongGlobal, isScrubbingProgressGlobal, prevSong, nextSong, determineSongPosition, setCurrentContext, previouslyPlayedModeRef, updatePlayerState, resetActualProgress}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
