import { useEffect, useState, type ChangeEvent, type ChangeEventHandler } from "react";
import SongSearchForm from "./SongSearchForm";
import RegularSpotifyPlayer from "./RegularSpotifyPlayer";
import MiniSpotifyPlayer from "./MiniSpotifyPlayer";
import LoginButton from "./LoginButton";
import { X } from "lucide-react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import SavedSongIndicator from "./SavedSongIndicator";
import SelectedSongIndicator from "./SelectedSongIndicator";

export type Song = {
  id: string;
  uri: string;
  album: string;
  albumCoverUrls: string[];
  title: string;
  artists: string;
  durationMS: number;
};

// Contains the song selected, the song notes, the form for searching for a song, and the music player; styles the music player to look like a player
function SongSelection({
  isEditing,
  isAddSongBtnActive,
  setIsAddSongBtnActive,
  songSelection,
  setSongSelection,
  songNotes,
  setSongNotes,
  onEdit,
  isSearching,
  setIsSearching,
  searchedSongToPlay,
  setSearchedSongToPlay,
  savedSongSelection,
  unsavedSongSelectionWasChanged,
  setUnsavedSongSelectionWasChanged,
}: {
  isEditing: boolean;
  isAddSongBtnActive: boolean;
  setIsAddSongBtnActive: any;
  songSelection: Song | null;
  setSongSelection: any;
  songNotes: string;
  setSongNotes: (arg0: string) => void;
  onEdit: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    updateType: "entry" | /*"song" |*/ "song notes",
  ) => void;
  isSearching: boolean;
  setIsSearching: (arg0: boolean) => void;
  searchedSongToPlay: Song | null;
  setSearchedSongToPlay: (searchedSongToPlay: Song | null) => void;
  savedSongSelection: Song | null;
  unsavedSongSelectionWasChanged: boolean;
  setUnsavedSongSelectionWasChanged: (wasUnsavedSongSelectionChanged: boolean) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedInVal = localStorage.getItem("isSpotifyLoggedIn");
    return isLoggedInVal? JSON.parse(isLoggedInVal) : false;
  });
  // const [songToPlay, setSongToPlay] = useState(songSelection);
  
  async function checkLoginStatus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const authStatus = await response.json();
      
      // console.log("Fetch was called.");
      
      setIsLoggedIn(authStatus.isLoggedIn);
      // console.log("is logged in?", authStatus.isLoggedIn);
    } catch (err) {
      console.log(err);
    }
  }

  checkLoginStatus();

  useEffect(() => {
    localStorage.setItem("isSpotifyLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const musicPlayer = useMusicPlayer();

  // On mount, ensure no music plays.
  useEffect(() => {
    const onMount = async () => {
      if (musicPlayer && musicPlayer.playerModeRef.current == "entry") {
        await musicPlayer.pause();
      }
    }

    onMount();
  }, [])

  let playerComponent;
  let searchFormComponent;
  let songNotesComponent;
  let loginBtnComponent;

  // Indicators of what song is saved and what is selected.
  let savedSongComponent;
  let selectedSongComponent;
  let songIndicatorsComponent; // grouped saved and selected song components

  // If this entry doesn't have an associated song or isn't trying to add a song selection, don't display anything for the song component.
  if (!songSelection || !isAddSongBtnActive) { // I FEEL LIKE I DON'T NEED "!songSelection"; GET RID OF LATER.
    playerComponent = null;
    searchFormComponent = null;
    songNotesComponent = null;
    loginBtnComponent = null;

    songIndicatorsComponent = null;
    savedSongComponent = null;
    selectedSongComponent = null;
  }

  // If there are song notes for this entry or when editing with the add song component active (a song is being added to the entry or a song selection is being edited), display the song notes component.
  if (isEditing && isAddSongBtnActive || songNotes) {
    songNotesComponent = (
      <textarea
        name="song-notes"
        id="song-notes"
        placeholder="Song Notes"
        readOnly={!isEditing}
        value={songNotes}
        className="w-full resize-none overflow-y-auto rounded border-2 border-blue-300 p-1.5 focus:border-blue-400 focus:outline-none"
        onChange={(event) => onEdit(event, "song notes")}
      ></textarea>
    );
  }

  // Render indicators of saved and selected songs (only when adding/editing a song selection).
  if (isEditing && isAddSongBtnActive) {
    savedSongComponent = <SavedSongIndicator savedSongSelection={savedSongSelection}/>;
    selectedSongComponent = <SelectedSongIndicator songSelection={songSelection}/>;

    songIndicatorsComponent = (
      <div className="border-2 rounded-lg p-2 flex flex-col gap-2 mb-2">
        {savedSongComponent}
        {selectedSongComponent}
      </div>
    )
  }

  // If the entry has a song selection or a song is being added to the entry, display the login button (when necessary) -- since song-related elements require Spotify access.
  if (isAddSongBtnActive) {
    loginBtnComponent = (
      <LoginButton isLoggedIn={isLoggedIn} checkLoginStatus={checkLoginStatus} />
    );
  }

  // Display song with regular music player if there is a song selection for this entry.
  if (songSelection) {
    playerComponent = (
      <RegularSpotifyPlayer
        songSelection={songSelection}
        isEditing={isEditing}
        isAddSongBtnActive={isAddSongBtnActive}
        setIsSearching={setIsSearching}
        setSongToPlay={setSearchedSongToPlay}
      ></RegularSpotifyPlayer>
    );
  }

  // Render the song search form when the user is trying to add a song to the entry.
  if (isSearching && !songSelection) {
    searchFormComponent = (
      <SongSearchForm
        setSongSelection={setSongSelection}
        setSongToPlay={setSearchedSongToPlay}
        setIsSearching={setIsSearching}
        savedSongSelection={savedSongSelection}
        songToPlay={searchedSongToPlay}
        songSelection={songSelection}
        unsavedSongSelectionWasChanged={unsavedSongSelectionWasChanged}
        setUnsavedSongSelectionWasChanged={setUnsavedSongSelectionWasChanged}
      ></SongSearchForm>
    );
  }

  // Render the song search form and mini player when the user is trying to search for songs.
  if (isEditing && isSearching && isAddSongBtnActive) {
    searchFormComponent = (
      <SongSearchForm
        setSongSelection={setSongSelection}
        setSongToPlay={setSearchedSongToPlay}
        setIsSearching={setIsSearching}
        savedSongSelection={savedSongSelection}
        songToPlay={searchedSongToPlay}
        songSelection={songSelection}
        unsavedSongSelectionWasChanged={unsavedSongSelectionWasChanged}
        setUnsavedSongSelectionWasChanged={setUnsavedSongSelectionWasChanged}
      ></SongSearchForm>
    );

    console.log("searchedSongToPlay", searchedSongToPlay)

    if (searchedSongToPlay) {
      playerComponent = (<MiniSpotifyPlayer
        currentTrackToPlay={searchedSongToPlay}
        isAddSongBtnActive={isAddSongBtnActive}
        songSelection={songSelection}
        savedSongSelection={savedSongSelection}
      ></MiniSpotifyPlayer>)
    }
  }

  return (
    <div className="relative h-108">
      {/* <LoginButton
        isLoggedIn={isLoggedIn}
        checkLoginStatus={checkLoginStatus}
        ></LoginButton> */}

      {/* X Button */}
      {isEditing && (songSelection || isAddSongBtnActive) && (
        <button
          className="absolute -top-3 -right-2 rounded-xl bg-red-400 p-0.5 hover:cursor-pointer"
          onClick={async () => {
            setIsAddSongBtnActive(false);

            // Wipe the song selection and its notes.
            setSongSelection(null);
            setSongNotes("");

            setIsSearching(false);

            // Reset the song that shows up in the mini player.
            setSearchedSongToPlay(null);

            // Pause song playing.
            if (musicPlayer) {
              await musicPlayer.pause();
            }
          }}
        >
          <X size={20} color="white" />
        </button>
      )}

      {isLoggedIn? 
        <div>
          {searchFormComponent}
          {playerComponent}
          {songIndicatorsComponent}
          {songNotesComponent}
        </div> :
        loginBtnComponent
      }
    </div>
  );
}

export default SongSelection;
