import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Song } from "../components/Music/SongSelection";
import useInterval from "../hooks/useInterval";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";

// Everything needed for components to render the entry and calendar player UI!
type MusicPlayerUI = {
  // For entry player:
  isReady: boolean;
  isPlaying: boolean;
  isLoadingSong: boolean;
  progress: number;
  trackToPlay: Song | null;
  
  togglePlay: (song?: Song | null, context?: null) => Promise<void>;
  setProgress: (progress: number) => void;
  setTrackToPlay: (song: Song | null) => void;
  
  
  // For calendar player:
  isPlayingGlobal: boolean;
  progressGlobal: number;
  isLoadingSongGlobal: boolean;
  isScrubbingProgressGlobal: RefObject<boolean>;
  currentSong: Spotify.Track | null;
  
  togglePlayGlobal: (monthSongUris: string[]) => Promise<void>;
  queueAndPlaySongs: (monthSongUris: string[]) => Promise<void>;
  setProgressGlobal: (progressGlobal: number) => void;
  setIsLoadingSongGlobal: (isLoadingSongGlobal: boolean) => void;
  prevSong: () => Promise<void>;
  nextSong: () => Promise<void>;
  
  
  // For both players:
  playerModeRef: RefObject<PlayerType | null>;
  isScrubbingProgress: RefObject<boolean>;
  volume: number,
  previouslyPlayedModeRef: RefObject<PlayerType | null>; 
  currentContext: Song | null;
  
  setCurrentContext: (context: Song | null) => void;
  pause: () => Promise<void>;
  seek: (timeToSeekTo: number, playerSeeking: PlayerType) => Promise<void>;
  setPlayerVolume: (newVolume: number) => Promise<void>;
  updatePlayerState: (currMode: PlayerType) => void;
  resetVisualProgress: (playerType: PlayerType) => void; 
  resetActualProgress: () => Promise<void>;
}

type PlayerType = "calendar" | "entry";

// One single global music player to be used to play a single song and a playlist of songs
const MusicPlayerContext = createContext<MusicPlayerUI | null>(null);

// Handles music playing functionality
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // Initialize actual music player. (using Spotify Player in this case)
  const { isReady, currentSong, ...musicPlayer } = useSpotifyPlayer();

  // Indicates whether the mode of the player (entry or calendar) or none (if neither has 
  // been played yet).
  const playerModeRef = useRef<PlayerType | null>(null);
  // Last played mode of the music player.
  const previouslyPlayedModeRef = useRef<PlayerType | null>(null);
  const [volume, setVolume] = useState(1); // Initial value of volume is 1 (out of 1).

  /***************************
   * For entry music player:
   **************************/
  // The song the user wants to play
  const [trackToPlay, setTrackToPlay] = useState<Song | null>(null);
  // The song currently loaded in the music player
  const [currentContext, setCurrentContext] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  // To indicate loading state while Spotify queues up the song to play.
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const isScrubbingProgress = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening
  // The visual progress, which differs from the actual progress of the song because it has to stay the same when a song is being resumed (being reloaded and seeking to the position it was last at) after switching from the calendar player
  const isResettingRef = useRef(false); // for stopping the useInterval from updating the progress when resetting the entry player
  
  /******************************
   * For calendar music player:
  *****************************/
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);
  const [progressGlobal, setProgressGlobal] = useState(0);
  // To indicate loading state while Spotify queues up the song to play.
  const [isLoadingSongGlobal, setIsLoadingSongGlobal] = useState(false);
  const isScrubbingProgressGlobal = useRef(false); // useRef so it doesn't trigger rerender; a flag to indicate if user is scrubbing so the progress can stop being updated while scrubbing is happening
  const isResettingGlobalRef = useRef(false); // for stopping the useInterval from updating the progress when resetting the entry player
  
  
  // --------------- Functions ---------------------  
  
  /**************************
   * Entry Player Functions *
   **************************/
  // Toggles music playing (but more...).
  // Note: only pass in song for queuedSong to queue up song; otherwise, default to passing in nothing (pausing/resuming)
  // Note: only pass in null for playerContext to queue up song; otherwise, default to passing in nothing
  // Note: passing in nothing for both params = pausing/resuming song playing
  // playerContext = song
  const togglePlay = async (queuedSong? : Song | null, playerContext? : null) => {
    const songToPlay = queuedSong ?? trackToPlay;

    let context;

    if (playerContext === undefined) {
      context = currentContext;
    } else {
      context = null;
    }

    // The very first song played (for the very first time) upon music player being ready.
    if (songToPlay && !context) {
      // Save this song as the new context.
      setCurrentContext(songToPlay);

      try {
        // Play the song.
        await queueAndPlaySong(songToPlay); // can't pass currentContext here b/c the state doesn't update immediately (React things...)
      } catch (err) {
        console.error(err);
      }
    } else if (songToPlay && context) {
      // For songs after the first play.

      // The user wants to resume/pause playing the same song.
      if (songToPlay.uri === context.uri && previouslyPlayedModeRef.current !== "calendar") {
        try {
          setIsPlaying(!isPlaying);
          await musicPlayer.togglePlay();
        } catch (err) {
          console.error(err);
        }
        // Pause/resume music playing.
      } else {
        // Note: unfortunately, when switching between calendar and entry players, there's really no good way to resume the entry player where it was paused, so I'm deciding to just reload the song to restart the progress all together.

        // The user wants to play a new song.

        // Save new context.
        setCurrentContext(songToPlay);

        try {
          // Play the new song.
          await queueAndPlaySong(songToPlay);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // Queues the current song to play.
  async function queueAndPlaySong(songToPlay: Song) {
    try {
      setIsLoadingSong(true);
      await musicPlayer.queueSong(songToPlay.uri);
      setIsPlaying(true);
      setIsLoadingSong(false);
    } catch (err) {
      console.error(err);
    }
  }


  /***************************
   * Global Player Functions *
   ***************************/
  // currSongPos = where to start in the playlist; not relevant rn tho b/c determine pos of song when playing queued songs
  async function togglePlayGlobal(monthSongUris: string[]) {
    // If switching from entry to calendar player, requeue the songs for the calendar player and start playing the song the calendar last played.
    if (previouslyPlayedModeRef.current === "entry") {
      try {
        await queueAndPlaySongs(monthSongUris);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        // Otherwise, continue playing/pausing.
        setIsPlayingGlobal(!isPlayingGlobal);
        await musicPlayer.togglePlay();
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  // For global player only (queue and play songs for the month selected)
  async function queueAndPlaySongs(monthSongUris: string[]) {
    setIsPlayingGlobal(false);
    setIsLoadingSongGlobal(true);

    try {
      await musicPlayer.queueMonthOfSongs(monthSongUris);

      setIsLoadingSongGlobal(false);
      resetVisualProgress("calendar");
      setIsPlayingGlobal(true);
    } catch (err) {
      console.error(err);
    }
  }

  // Mainly used to know current song for calendar player (b/c UI can keep track of 
  // current song for entry player)
  // function getCurrSong() {
  //   return musicPlayer.getCurrSong();
  // }
  
  async function prevSong() {
    try {
      resetVisualProgress("calendar");
      await musicPlayer.playPrevSong();
      setIsPlayingGlobal(true);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function nextSong() {
    try {
      resetVisualProgress("calendar");
      await musicPlayer.playNextSong();
      setIsPlayingGlobal(true);
    } catch (err) {
      console.error(err);
    }
  }
  

  // Note: Tried implementing a function to determine song position for the calendar 
  // player (so that I could also display which entry the song is from, but I couldn't 
  // figure it out). Can reference previous commits to see what I was trying to do.
  

  /***************************
   * Shared Player Functions *
   ***************************/
  async function pause() {
    try {
      await musicPlayer.pause();

      if (playerModeRef.current === "entry") {
        setIsPlaying(false);
      } else {
        setIsPlayingGlobal(false);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  // time (in ms); playerSeeking = the player trying to seek
  async function seek(timeToSeekTo: number, playerSeeking: PlayerType) {
    // Only seek if the player seeking is the one "active".
    if (playerModeRef.current === playerSeeking) {
      try {
        await musicPlayer.seek(timeToSeekTo);
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  // Resets VISUAL progress of music playing.
  function resetVisualProgress(playerType: PlayerType) {
    if (playerType === "entry") {
      isResettingRef.current = true;
      setProgress(0);
      isResettingRef.current = false;
    } else {
      isResettingGlobalRef.current = true;
      setProgressGlobal(0);
      isResettingGlobalRef.current = false;
    }
  }
  
  function updatePlayerState(currMode: PlayerType) {
    // Save the previous mode that the player was in.
    previouslyPlayedModeRef.current = playerModeRef.current;
    
    // Update the current mode now that a change was made by the user. (User interacting with a player)
    playerModeRef.current = currMode;
    
    // Reset the other player's progress if needed (so it VISUALLY resets).
    if (previouslyPlayedModeRef.current !== currMode) {
      if (currMode === "entry") {
        resetVisualProgress("calendar");
        setIsPlayingGlobal(false);
      } else  {
        resetVisualProgress("entry");
        setIsPlaying(false);
      }
    }
  }

  async function setPlayerVolume(newVolume: number) {
    try {
      await musicPlayer.setNewVolume(newVolume);
      setVolume(newVolume);
    } catch (err) {
      console.error(err);
    }
  }

  async function resetActualProgress() {
    await musicPlayer.seek(0);
  }


  // Update the progress of the song being played every second.
  useInterval(() => {
    const updateProgress = async () => {
      const currProgress = await musicPlayer.getProgress();
      setProgress(currProgress);
      if (currProgress === 0) {
        setIsPlaying(false);
      }
    }

    const updateProgressGlobal = async () => {
      const currProgress = await musicPlayer.getProgress();
      setProgressGlobal(currProgress);
      if (currProgress === 0) {
        setIsPlayingGlobal(false);
      }
    }

    if (playerModeRef.current === "entry") {
      // Don't update the progress state while scrubbing is happening or while the entry player is resetting its (visual) progress. (Otherwise, it'll be jumpy)
      if (isScrubbingProgress.current || isResettingRef.current) {
        return;
      }
      
      // Otherwise, update the progress.
      updateProgress();
    } else {
      // Don't update the progress state while scrubbing is happening or while the calendar player is resetting its (visual) progress. (Otherwise, it'll be jumpy)
      if (isScrubbingProgressGlobal.current || isResettingGlobalRef.current) {
        return;
      }
      
      // Otherwise, update the progress.
      updateProgressGlobal();
    }
  }, (isPlaying || isPlayingGlobal) && isReady && (!isLoadingSong || !isLoadingSongGlobal) && (currentContext || playerModeRef.current === "calendar") ? 1000 : null); // may have to change `mode === "calendar"` part of condition to be more specifically when calendar player has a current song loaded up/shown

  return (
    <MusicPlayerContext.Provider value={{isReady, isPlaying, togglePlay, progress, setProgress, resetVisualProgress, trackToPlay, setTrackToPlay, isLoadingSong, pause, currentContext, seek, isScrubbingProgress, setPlayerVolume, volume, togglePlayGlobal, playerModeRef, isPlayingGlobal, progressGlobal, setProgressGlobal, isLoadingSongGlobal, setIsLoadingSongGlobal, isScrubbingProgressGlobal, prevSong, nextSong, setCurrentContext, previouslyPlayedModeRef, updatePlayerState, resetActualProgress, currentSong, queueAndPlaySongs}}>
      { children }
    </MusicPlayerContext.Provider>
  )
}

// Custom hook to use the music player context.
export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
