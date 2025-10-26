import { useState, type FormEvent } from "react";
import { Search, Check, Play } from "lucide-react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import type { Song } from "./SongSelection";

type Track = {
  album: {
    name: string;
    largeCoverImgURL: string;
    mediumCoverImgURL: string;
    smallCoverImgURL: string;
  };
  artists: string[];
  durationMS: string;
  id: string;
  name: string;
  uri: string;
};

function SongSearchForm({
  setSongSelection,
  setSongToPlay,
  setIsSearching,
  savedSongSelection,
  songToPlay,
  songSelection, // unsaved
  unsavedSongSelectionWasChanged,
  setUnsavedSongSelectionWasChanged,
}: {
  setSongSelection: any;
  setSongToPlay: any;
  setIsSearching: (isSearching: boolean) => void;
  savedSongSelection: Song | null;
  songToPlay: Song | null;
  songSelection: Song | null;
  unsavedSongSelectionWasChanged: boolean;
  setUnsavedSongSelectionWasChanged: (wasUnsavedSongSelectionChanged: boolean) => void;
}) {
  const [searchContent, setSearchContent] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  // const [unsavedSongSelectionWasChanged, setUnsavedSongSelectionWasChanged] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    console.log(searchContent);

    // Make request for the song.
    if (searchContent !== "") {
      try {
        const response = await fetch(
          `${apiUrl}/songs?search=${encodeURIComponent(searchContent)}`,
          { credentials: "include" }, // to send cookies w/ the request
        );
        const results = await response.json();

        setSearchResults(results);
      } catch (err) {
        // In the case that the request fails, tell user to log in again.

        console.log(err);
      }
    }
  }

  const musicPlayer = useMusicPlayer();

  return (
    // Song Search container
    <div className="mb-3 rounded-lg border-2 px-4 py-5">
      <div className="flex h-73 flex-col gap-5">
        {/* The search bar and button */}
        <form onSubmit={handleFormSubmit} className="relative flex gap-4">
          {/* Search Bar */}
          <Search size={22} className="absolute top-2 left-2.5" />
          <input
            type="text"
            value={searchContent}
            name="song-title"
            id="song-title"
            placeholder="Search for a song"
            onChange={(event) => setSearchContent(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-3xl border-2 px-5 pl-10"
          />

          {/* Search button */}
          <button
            type="submit"
            className="rounded-3xl bg-blue-400 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-500"
          >
            Search
          </button>
        </form>

        {searchResults && (
          // Container of search results
          <div className="flex flex-col gap-y-2 overflow-y-auto pr-3">
            {searchResults.map((trackObj: Track, i) => {
              const songTitle = trackObj.name;
              const songID = trackObj.id;
              const songURI = trackObj.uri;
              const durationMS = +trackObj.durationMS;
              const songArtistsList = trackObj.artists;
              let songArtists = songArtistsList.reduce(
                (names, artistName) => (names += `${artistName}, `),
                "",
              );
              songArtists = songArtists.slice(0, songArtists.length - 2);
              const album = trackObj.album;
              const albumTitle = album.name;
              const largeAlbumCoverUrl = album.largeCoverImgURL;
              const medAlbumCoverUrl = album.mediumCoverImgURL;
              const smallAlbumCoverUrl = album.smallCoverImgURL;
              return (
                <div key={i} className="flex gap-x-2">
                  {/* Album Cover */}
                  <div className="relative">
                    {/* Play button on album cover */}
                    <button
                      className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 not-even:hover:bg-gray-200/20"
                      onClick={async () => {
                        const clickedSong = (
                          {
                          id: songID, // technically dont need
                          uri: songURI,
                          album: albumTitle, // technically dont need
                          albumCoverUrls: [
                            smallAlbumCoverUrl,
                            medAlbumCoverUrl,
                            largeAlbumCoverUrl,
                          ],
                          title: songTitle,
                          artists: songArtists,
                          durationMS: durationMS,
                        }
                        );

                        setSongToPlay(clickedSong)

                        // Immediately queue up and play the song clicked on.
                        if (musicPlayer) {
                          // Pass the track in b/c state doesn't update immediately but still need to update state for later references to it in togglePlay.
                          musicPlayer.resetProgress(); // Always reset the progress when a song is clicked on.
                          await musicPlayer.togglePlay(clickedSong, null);
                          musicPlayer?.setTrackToPlay(clickedSong);
                          // Need this for the player to look visually paused immediately.
                          musicPlayer.setIsPlaying(true);
                        }
                      }}
                    >
                      <Play fill="white" />
                    </button>
                    <img
                      src={largeAlbumCoverUrl}
                      alt={`Cover of the album ${albumTitle}`}
                      className="block h-16 w-16 rounded-lg"
                    ></img>
                  </div>

                  <div className="flex flex-1 justify-between">
                    {/* Song Info */}
                    <div className="">
                      {/* Set the class as truncate later and give the width a fixed size to make the title and artists truncate instead of wrapping */}
                      <p className="">{songTitle}</p>
                      <p className="text-sm text-gray-500">{songArtists}</p>
                    </div>

                    {/* BUT I ONLY WANT THE CHECK TO APPEAR WHEN HOVERING OVER A SONG */}

                    {/* Button for selecting a song for the entry */}
                    <div className="flex items-center">
                      <button
                        className="rounded bg-green-400 p-1 hover:cursor-pointer hover:bg-green-500"
                        onClick={async () => {
                          const selectedSong = {
                            id: songID, // technically dont need
                            uri: songURI,
                            album: albumTitle, // technically dont need
                            albumCoverUrls: [
                              smallAlbumCoverUrl,
                              medAlbumCoverUrl,
                              largeAlbumCoverUrl,
                            ],
                            title: songTitle,
                            artists: songArtists,
                            durationMS: durationMS,
                          }

                          // Pause the music player.
                          // if (musicPlayer) {
                          //   await musicPlayer.pause();
                          // }
                          let isSongSelectionDiff; // as of right now, selecting this song
                          if (songSelection?.uri !== selectedSong.uri) {
                            setUnsavedSongSelectionWasChanged(true);
                            isSongSelectionDiff = true;
                          }

                          if (musicPlayer) {
                            // Given there is a song selection saved for the entry
                            if (savedSongSelection) {
                              console.log("1");
                              console.log("This should be true", unsavedSongSelectionWasChanged || isSongSelectionDiff);

                              // If the selected song is not the one that is currently saved or it is but was changed in between, pause the player and reset the progress so the song just selected can be loaded up again by the player.
                              if (selectedSong.uri !== savedSongSelection?.uri || (selectedSong.uri === savedSongSelection?.uri && (unsavedSongSelectionWasChanged || isSongSelectionDiff))) { /* RN IDEK WHAT MAKES THIS WORK AND WHAT DOESN'T. IT MAYBE BE THAT I DONT EVEN NEED "(selectedSong.uri === savedSongSelection?.uri && (unsavedSongSelectionWasChanged || isSongSelectionDiff))" THIS PART BUT I HAVE NO CLUE AND I DO NOT WANT TO MESS WITH IT AND BREAK IT B/C I DONT HAVE TESTS TO VERIFY ANYTHING AND THERE ARE TOO MANY SCENARIOS FOR ME TO REMEMBER TO RECREATE MANUALLY -- TEST AND TRY TAKING THAT PART OUT LATER */
                                console.log("IT SHOULD BE IN HERE!");
                                if (songToPlay?.uri !== selectedSong.uri) {
                                  console.log("2");
                                  await musicPlayer.pause();
                                  await musicPlayer?.resetProgress();
                                }
                              }
                            } else {
                              // Given there isn't a song selection saved for the entry
                              console.log("3");

                              // If the song being played by the mini player is not the last (unsaved) selected song, pause the player and reset the progress so the song just selected can be loaded up by the player.
                              if (songToPlay?.uri !== selectedSong.uri) {
                                console.log("4");
                                await musicPlayer.pause();
                                await musicPlayer?.resetProgress();
                              }
                            }
                          }
                          setSongSelection(selectedSong);
                          // console.log("is this what was set?", selectedSong.title);
                          // setSongToPlay(selectedSong);

                          console.log(songTitle);
                          setIsSearching(false);
                        }}
                      >
                        <Check color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SongSearchForm;
