import { useEffect, useState, type ChangeEvent, type ChangeEventHandler } from "react";
import SongSearchForm from "./SongSearchForm";
import RegularSpotifyPlayer from "./RegularSpotifyPlayer";
import MiniSpotifyPlayer from "./MiniSpotifyPlayer";
import LoginButton from "./LoginButton";
import { X } from "lucide-react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

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
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedInVal = localStorage.getItem("isSpotifyLoggedIn");
    return isLoggedInVal? JSON.parse(isLoggedInVal) : false;
  });
  const [songToPlay, setSongToPlay] = useState(songSelection);
  
  async function checkLoginStatus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const authStatus = await response.json();
      
      // console.log("Fetch was called.");
      
      setIsLoggedIn(authStatus.isLoggedIn);
      console.log("is logged in?", authStatus.isLoggedIn);
    } catch (err) {
      console.log(err);
    }
  }

  checkLoginStatus();

  useEffect(() => {
    localStorage.setItem("isSpotifyLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const musicPlayer = useMusicPlayer();

  // On mount, ensure no music plays. -- DOESN'T WORK
  useEffect(() => {
    const onMount = async () => {
      if (musicPlayer) {
        await musicPlayer.pause();
      }
    }

    onMount();
  }, [])

  let playerComponent;
  let searchFormComponent;
  let songNotesComponent;
  let loginBtnComponent;

  // If this entry doesn't have an associated song, don't display anything for the song component.
  if (!songSelection || (!songSelection && !isAddSongBtnActive)) {
    playerComponent = null;
    searchFormComponent = null;
    songNotesComponent = null;
    loginBtnComponent = null;
  }

  // Display song with regular music player if there is a song selection for this entry.
  if (songSelection) {
    loginBtnComponent = (
      <LoginButton isLoggedIn={isLoggedIn} checkLoginStatus={checkLoginStatus} />
    );

    playerComponent = (
      <RegularSpotifyPlayer
        songSelection={songSelection}
        isEditing={isEditing}
        isAddSongBtnActive={isAddSongBtnActive}
        setIsSearching={setIsSearching}
      ></RegularSpotifyPlayer>
    );

    if (songNotes || isEditing) {
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
  }

  
  if (isAddSongBtnActive && isEditing && !songSelection) {
    // Render the song search form and notes section when the user is trying to add a song to the entry.
    loginBtnComponent = (
      <LoginButton isLoggedIn={isLoggedIn} checkLoginStatus={checkLoginStatus} />
    );

    searchFormComponent = (
      <SongSearchForm
        setSongSelection={setSongSelection}
        setSongToPlay={setSongToPlay}
        setIsSearching={setIsSearching}
      ></SongSearchForm>
    );

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

  // Render a mini song player when the user is searching for songs for this entry and is trying to play one.
  if (isAddSongBtnActive && isEditing && !songSelection && songToPlay) {
    playerComponent = (
      <MiniSpotifyPlayer
        currentTrackToPlay={songToPlay}
        isAddSongBtnActive={isAddSongBtnActive}
      ></MiniSpotifyPlayer>
    );
  }

  // Render the song search form and mini player when the user is trying to search for songs.
  if (isEditing && isSearching && isAddSongBtnActive) {
    searchFormComponent = (
      <SongSearchForm
        setSongSelection={setSongSelection}
        setSongToPlay={setSongToPlay}
        setIsSearching={setIsSearching}
      ></SongSearchForm>
    );

    playerComponent = (<MiniSpotifyPlayer
        currentTrackToPlay={songToPlay}
        isAddSongBtnActive={isAddSongBtnActive}
      ></MiniSpotifyPlayer>)
  }

  // // Only render the song notes in non-edit view if there is a song selected as well.
  // if (songNotes && songSelection) {
  //   songNotesComponent = (
  //     <textarea
  //       name="song-notes"
  //       id="song-notes"
  //       placeholder="Song Notes"
  //       readOnly={!isEditing}
  //       value={songNotes}
  //       className="w-full resize-none overflow-y-auto rounded border-2 border-blue-300 p-1.5 focus:border-blue-400 focus:outline-none"
  //       onChange={(event) => onEdit(event, "song notes")}
  //     ></textarea>
  //   );
  // }

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
          onClick={() => {
            setIsAddSongBtnActive(false);

            // Wipe the song selection and its notes.
            setSongSelection(null);
            setSongNotes("");

            setIsSearching(false);
          }}
        >
          <X size={20} color="white" />
        </button>
      )}

      {isLoggedIn? 
        <div>
          {searchFormComponent}
          {playerComponent}
          {songNotesComponent}
        </div> :
        loginBtnComponent
      }
    </div>
  );
}

export default SongSelection;
