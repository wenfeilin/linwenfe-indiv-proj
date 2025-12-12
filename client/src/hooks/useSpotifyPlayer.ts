import { useState } from "react";
import useSpotifySDKInit from "./useSpotifySDKInit";
import type MusicPlayer from "../interfaces/MusicPlayer";

// A hook that acts as an implementation of the MusicPlayer interface b/c it needs to be 
// able to use a custom hook inside it and states, which a regular class doesn't allow.
function useSpotifyPlayer(): MusicPlayer {
  // Interface fields
  const { playerRef, deviceId,  isReady, currentSong }  = useSpotifySDKInit();
  // const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1.0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


// MIGHT NOT NEED THESE TWO: ESP IF UI SIDE IS NOT EVEN REFERENCING THESE
  // isPlaying: boolean;
  // isLoading: boolean; // for when queuing up songs

  async function pause() {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.pause();
        setIsPlaying(false);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function togglePlay() {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.togglePlay();
        setIsPlaying(!isPlaying);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // For entry player (even tho it's named "queue", due to how the Spotify player works, it also inevitably starts playing the music as soon as it's queued up)
  async function queueSong(songUri: string) {
    if (playerRef.current && isReady) {
      setIsLoading(true);
      setIsPlaying(false);
  
      const apiUrl = import.meta.env.VITE_API_URL;
  
      try {
        // Play the song specified by the URI when play is pressed.
        const play_song_req_body = {
          device_id: deviceId,
          uris: [songUri],
        };
  
        await fetch(`${apiUrl}/player/play`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(play_song_req_body),
          credentials: "include",
        });
  
        setIsLoading(false);
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // For calendar player (even tho it's named "queue", due to how the Spotify player works, it also inevitably starts playing the music as soon as it's queued up)
  async function queueMonthOfSongs(songUris: string[]) {
    if (playerRef.current && isReady) {
      setIsPlaying(false);
      setIsLoading(true);
  
      // Request API to queue up month's songs.
      const apiUrl = import.meta.env.VITE_API_URL;
  
      const reqBody = {
        device_id: deviceId,
        uris: songUris,
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
  
        setIsLoading(false);
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function setNewVolume(newVolume: number) {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.setVolume(newVolume);
        setVolume(newVolume);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function seek(timeToSeekTo: number) {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.seek(timeToSeekTo);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function playPrevSong() {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.previousTrack();
  
        const state = await playerRef.current.getCurrentState();
  
        // If trying to play previous song when only one song is queued in context, play the same 
        // song again from the start.
        if (state) {
          if (state.track_window.previous_tracks.length === 0) {
            await resetActualProgress();
            await playerRef.current.resume();
            setIsPlaying(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function playNextSong() {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.nextTrack();
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function getCurrSong() {
    if (playerRef.current && isReady) {
      // return currentSong;
      const state = await playerRef.current?.getCurrentState();
      return state?.track_window.current_track ?? null;
    }

    return null;
  }

  async function getProgress() {
    if (playerRef.current && isReady) {
      try {
        const state = await playerRef.current.getCurrentState();
        return state?.position ?? -2; // random num to differentiate from -1
      } catch (err) {
        console.error(err);
      }
    }
    return -1; // let's hope this never gets returned...
  }

  async function resetActualProgress() {
    if (playerRef.current && isReady) {
      try {
        await playerRef.current.seek(0);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return {
    isReady, 
    currentSong,
    isPlaying,
    isLoading,
    // progress,
    volume,

    pause,
    togglePlay,
    queueSong,
    queueMonthOfSongs,
    setNewVolume,
    seek,
    playPrevSong,
    playNextSong,
    getCurrSong,
    getProgress
  }
}

export default useSpotifyPlayer;