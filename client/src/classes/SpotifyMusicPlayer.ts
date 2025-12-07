import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import type MusicPlayer from "../interfaces/musicPlayer";
import type { PlayerType } from "../interfaces/musicPlayer";

class SpotifyMusicPlayer implements MusicPlayer {
  // Interface fields
  isReady: boolean;
  currentSong: Spotify.Track | null;
  progress: number;
  volume: number;
  playerMode: PlayerType | null;
  #playerRef: React.RefObject<Spotify.Player | null>;
  #deviceId: string | null;

// MIGHT NOT NEED THESE TWO: ESP IF UI SIDE IS NOT EVEN REFERENCING THESE
  isPlaying: boolean;
  isLoading: boolean; // for when queuing up songs

  
  constructor() {
    // On page load, there is no song to play yet.
    
    // Creates and connects a single global music player.
    const { playerRef, deviceId, isReady, currentSong } = useSpotifyPlayer(); // currentSong is for global player to remember which song it is currently playing/paused on
    this.#playerRef = playerRef;
    this.#deviceId = deviceId;

    this.isReady = isReady;
    this.currentSong = currentSong;
    this.isPlaying = false;
    this.isLoading = false;
    this.progress = 0;
    this.volume = 1;
    this.playerMode = null;
  }

  // Interface functions
  // ideally should have only play and pause? and in spotify's ver of play, have it queue up songs?
  async pause() {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.pause();
        this.isPlaying = false;
      } catch (err) {
        console.error(err);
      }
    }
  }

  async togglePlay() {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.togglePlay();
        this.isPlaying = !this.isPlaying;
      } catch (err) {
        console.error(err);
      }
    }
  }

  // For entry player (even tho it's named "queue", due to how the Spotify player works, it also inevitably starts playing the music as soon as it's queued up)
  async queueSong(songUri: string) {
    if (this.#playerRef.current && this.isReady) {
      this.isLoading = true;
      this.isPlaying = false;
  
      const apiUrl = import.meta.env.VITE_API_URL;
  
      try {
        // Play the song specified by the URI when play is pressed.
        const play_song_req_body = {
          device_id: this.#deviceId,
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
  
        this.isLoading = false;
        this.isPlaying = true;
      } catch (err) {
        console.error(err);
      }
    }
  }

  // For calendar player (even tho it's named "queue", due to how the Spotify player works, it also inevitably starts playing the music as soon as it's queued up)
  async queueMonthOfSongs(songUris: string[]) {
    if (this.#playerRef.current && this.isReady) {
      this.isPlaying = false;
      this.isLoading = true;
  
      // Request API to queue up month's songs.
      const apiUrl = import.meta.env.VITE_API_URL;
  
      const reqBody = {
        device_id: this.#deviceId,
        uris: songUris,
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
  
        this.isLoading = false;
        this.isPlaying = true;
      } catch (err) {
        console.error(err);
      }
    }
  }

  async setVolume(newVolume: number) {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.setVolume(newVolume);
        this.volume = newVolume;
      } catch (err) {
        console.error(err);
      }
    }
  }

  async seek(timeToSeekTo: number) {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.seek(timeToSeekTo);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async playPrevSong() {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.previousTrack();
  
        const state = await this.#playerRef.current.getCurrentState();
  
        // If trying to play previous song when only one song is queued in context, play the same 
        // song again from the start.
        if (state) {
          if (state.track_window.previous_tracks.length === 0) {
            await this.#resetActualProgress();
            await this.#playerRef.current.resume();
            this.isPlaying = true;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async playNextSong() {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.nextTrack();
        this.isPlaying = true;
      } catch (err) {
        console.error(err);
      }
    }
  }

  getCurrSong() {
    if (this.#playerRef.current && this.isReady) {
      return this.currentSong;
      // try {
      //   const state = await this.#playerRef.current.getCurrentState();
      //   return state?.track_window.current_track ?? null;
      // } catch (err) {
      //   console.error(err);
      // }
    }

    return null;
  }

  async getProgress() {
    if (this.#playerRef.current && this.isReady) {
      try {
        const state = await this.#playerRef.current.getCurrentState();
        return state?.position ?? -1;
      } catch (err) {
        console.error(err);
      }
    }
    return -1; // let's hope this never gets returned...
  }

  // Private Helper Functions
  async #resetActualProgress() {
    if (this.#playerRef.current && this.isReady) {
      try {
        await this.#playerRef.current.seek(0);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default SpotifyMusicPlayer;