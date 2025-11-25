import type { Song } from "../components/Music/SongSelection";

export default interface MusicPlayer {
  // Fields to represent state of music player
  isReady: boolean;
  isPlaying: boolean;
  progress: number;
  currentTrack: Song | null;
  volume: number;

  // Music-playing functionalities
  // ideally should have only play and pause? and in spotify's ver of play, have it queue up songs?
  pause(): Promise<void>;
  togglePlay(): Promise<void>;
  queueSong?(songToQueue: Song): Promise<void>;
  setVolume(newVolume: number): Promise<void>;
  seek(timeToSeekTo: number): Promise<void>;
  playPrevSong(): Promise<void>;
  playNextSong(): Promise<void>;
}
