export type PlayerType = "calendar" | "entry";

export default interface MusicPlayer {
  // "Fields" to represent state of music player
  isReady: boolean;
  currentSong: Spotify.Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  // progress: number;
  volume: number;

  // Music-playing functionalities
  pause(): Promise<void>;
  togglePlay(): Promise<void>; // provide queued song uri for when calendar mode switches to entry mode; provide song uris for when entry mode switches to calendar mode
  queueSong(songUri: string): Promise<void>;
  queueMonthOfSongs(songUris: string[]): Promise<void>;
  setNewVolume(newVolume: number): Promise<void>;
  seek(timeToSeekTo: number): Promise<void>;
  playPrevSong(): Promise<void>;
  playNextSong(): Promise<void>;
  getCurrSong(): Promise<Spotify.Track | null>;
  getProgress(): Promise<number>;
}
