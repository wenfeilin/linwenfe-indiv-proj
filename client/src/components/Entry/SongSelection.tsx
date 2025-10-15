import { useState, type ChangeEvent, type ChangeEventHandler } from "react";
import SongSearchForm from "./SongSearchForm";
import SpotifyPlayer from "./SpotifyPlayer";
import LoginButton from "../LoginButton";
import { X } from "lucide-react";

export type Song = {
  id: string;
  uri: string;
  album: string;
  albumCoverUrl: string;
  title: string;
  artists: string;
  durationMS: number;
};

// Contains the song selected, the song notes, the form for searching for a song, and the music player; styles the music player to look like a player
function SongSelection({
  isEditing,
  addingSong,
  setAddingSong,
  songSelection,
  setSongSelection,
  songNotes,
  onEdit,
}: {
  isEditing: boolean;
  addingSong: boolean;
  setAddingSong: any;
  songSelection: Song | null;
  setSongSelection: any;
  songNotes: string;
  onEdit: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    updateType: "entry" | /*"song" |*/ "song notes",
  ) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [songToPlay, setSongToPlay] = useState(songSelection);

  async function checkLoginStatus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const body = await response.json();

      // console.log("Fetch was called.");

      setIsLoggedIn(body.loggedIn);

      // console.log("Login status was set as: ", body.loggedIn);
    } catch (err) {
      console.log(err);
    }
  }

  // If edit mode is off and there is no songSelection for the entry, hide everything.
  if (!isEditing && !songSelection) {
    return null;
  }

  // If edit mode is off and there is a songSelection for the entry, show the music player (can't select another song).
  if (!isEditing && songSelection) {
    return <div>{/* <SpotifyPlayer></SpotifyPlayer> */}</div>;
  }

  // If edit mode is on and there is no songSelection for the entry, show the search form and the song notes (editable).
  if (isEditing && !songSelection) {
  }

  // If edit mode is on and there is a songSelection for the entry, show the music player w/ the "select another song" button visible.
  if (isEditing && songSelection) {
    <div>{/* <SpotifyPlayer></SpotifyPlayer> */}</div>;
  }

  return (
    // Contain the player and song search form.

    <div className="relative h-108">
      {/* <input
        type="text"
        id="song"
        placeholder="Song Title - Artist"
        readOnly={isDisabled}
        value={songSelection? songSelection.title : ""}
        className="rounded border-2 border-blue-300 focus:border-blue-400 focus:outline-none px-1.5"
        onChange={(event) => onEdit(event, "song")}
      /> */}

      {/*  */}

      {/* <LoginButton
        isLoggedIn={isLoggedIn}
        checkLoginStatus={checkLoginStatus}
        ></LoginButton> */}

      {/* X Button */}
      <button
        className="absolute -top-3 -right-2 rounded-xl bg-red-400 p-0.5 hover:cursor-pointer"
        onClick={() => setAddingSong(false)}
      >
        <X size={20} color="white" />
      </button>

      {/* If there is a song saved for this entry and we are not in edit mode, render the music player*/}
      {/* If there is a song saved for this entry and we are in edit mode, render the music player w/ a "Choose another song" button*/}
      {/* <SpotifyPlayer></SpotifyPlayer> */}

      {/* If there isn't a song saved for this entry and we are in edit mode, render the song search form. */}
      {
        songSelection && (
          <SongSearchForm setSongSelection={setSongSelection} setSongToPlay={setSongToPlay}></SongSearchForm>
        )
      }
      <SpotifyPlayer currentTrackToPlay={songToPlay} addingSong={addingSong}></SpotifyPlayer>

      {/* Song Notes */}
      <textarea
        name="song-notes"
        id="song-notes"
        placeholder="Song Notes"
        readOnly={!isEditing}
        value={songNotes}
        className="resize-none overflow-y-auto rounded border-2 border-blue-300 p-1.5 focus:border-blue-400 focus:outline-none"
        onChange={(event) => onEdit(event, "song notes")}
      ></textarea>
    </div>
  );
}

export default SongSelection;
