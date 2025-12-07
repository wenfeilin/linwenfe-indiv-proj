export type PlayerType = "calendar" | "entry";

export default interface MusicPlayer {
  // Fields to represent state of music player
  isReady: boolean;
  currentSong: Spotify.Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  // currentTrack: string | null;
  volume: number;
  playerMode: PlayerType | null; // calendar or entry player mode
  // previouslyPlayedMode: PlayerType | null; // for knowing when to play/pause on current mode or to queue up songs for new mode

  // do i need some type of calendar / entry type distinction? b/c that's how the FE is structured; it's not specific to Spotify (pass into fxns)

  // Music-playing functionalities
  // ideally should have only play and pause? and in spotify's ver of play, have it queue up songs?
  pause(): Promise<void>;
  togglePlay(): Promise<void>; // provide queued song uri for when calendar mode switches to entry mode; provide song uris for when entry mode switches to calendar mode
  queueSong(songUri: string): Promise<void>;
  queueMonthOfSongs(songUris: string[]): Promise<void>;
  setVolume(newVolume: number): Promise<void>;
  seek(timeToSeekTo: number): Promise<void>;
  playPrevSong(): Promise<void>;
  playNextSong(): Promise<void>;
  getCurrSong(): Spotify.Track | null;
  getProgress(): Promise<number>;
}
