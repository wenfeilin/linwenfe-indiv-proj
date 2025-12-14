import { useEffect, useState, type ChangeEvent } from "react";
import { useEntries } from "../../contexts/EntriesContext";
import SaveButton from "./SaveButton";
import { useParams } from "react-router";
import EditButton from "./EditButton";
import CancelButton from "./CancelButton";
import { getMonthName } from "../../utils/date";
import SongSelection from "../Music/SongSelection";
import AddSongButton from "./AddSongButton";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useBlocker } from "../../hooks/useBlocker";

// The entry content (entry and song selection)
function Entry({checkLoginStatus, setIsLoggedIn, isLoggedIn}: {checkLoginStatus: any, setIsLoggedIn: (isLoggedIn: boolean) => void, isLoggedIn: boolean}) {
  const entries = useEntries();
  const { year, month, day } = useParams();

  // Keep track of changes to this local copy of the entry.
  const entryDate = `${year}-${month}-${day}`;
  const entry = entries.find((entry) => entry.date === entryDate);

  // Initially render content of entry or nothing if this entry is not filled.
  const [entryContent, setEntryContent] = useState(entry ? entry.content : "");
  const [songSelection, setSongSelection] = useState(
    entry ? (entry.songSelection ?? null) : null,
  );
  const [songNotes, setSongNotes] = useState(entry ? (entry.songNotes ?? "") : "");
  const [isEditing, setIsEditing] = useState(false);
  // Note: assume that isAddSongBtnActive can be active also in saved mode (just depends if the song selection exists). (Um... the comment I wrote is not true -- i mean, just look at the initial value of this thing, but it works, so i'm not going to debug/rework the logic for now.)
  const [isAddSongBtnActive, setIsAddSongBtnActive] = useState(entry?.songSelection ? true : false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchedSongToPlay, setSearchedSongToPlay] = useState(songSelection);

  const [unsavedSongSelectionWasChanged, setUnsavedSongSelectionWasChanged] = useState(false);

  // Determine what buttons will be rendered for the entry based on if it's in Edit mode or not.
  let buttonsRow;

  if (!isEditing) {
    buttonsRow = (
      <EditButton
        onEdit={() => {
          setIsEditing(true);
        }}
        setIsAddSongBtnActive={setIsAddSongBtnActive}
        songSelection={songSelection}
      ></EditButton>
    );
  } else {
    buttonsRow = (
      <div className="flex justify-between">
        {/* Add Song Button */}
        <AddSongButton isAddSongBtnActive={isAddSongBtnActive || (songSelection ? true : false)} setIsAddSongBtnActive={setIsAddSongBtnActive} setIsSearching={setIsSearching}></AddSongButton>

        <div className="flex gap-2">
          {/* Cancel Edits Button */}
          <CancelButton
            onCancel={async () => {
              let songSelectionBeforeEdit;
              if (entry !== undefined) {
                songSelectionBeforeEdit = entry.songSelection
                  ? entry.songSelection
                  : null;
              } else {
                songSelectionBeforeEdit = null;
              }
              setIsEditing(false);
              setIsSearching(false);
              // Reset edits.
              setEntryContent(entry ? entry.content : "");
              setSongSelection(songSelectionBeforeEdit);
              setSongNotes(entry ? entry.songNotes : "");
              // Reset song for mini player.
              if (!songSelectionBeforeEdit) {
                setSearchedSongToPlay(null);
                setIsAddSongBtnActive(false);
              }
              // Only stop playing music if the song being played is not the song selection before edit.
              if (musicPlayer) {
                if ((songSelectionBeforeEdit?.uri !== musicPlayer.currentContext?.uri) && musicPlayer.playerModeRef.current === "entry") {
                  await musicPlayer.pause();
                  musicPlayer.resetVisualProgress("entry");
                }
              }
            }}>
          </CancelButton>
          {/* Save Edits Button */}
          <SaveButton
            newEntryContent={entryContent}
            newSongSelection={songSelection}
            newSongNotes={songNotes}
            entryBeingSaved={entry} // The entry before being saved
            setIsAddSongBtnActive={setIsAddSongBtnActive}
            onSave={() => setIsEditing(false)}
            setIsSearching={setIsSearching}
            setSearchedSongToPlay={setSearchedSongToPlay}
            unsavedSongSelectionWasChanged={unsavedSongSelectionWasChanged}
          ></SaveButton>
        </div>
      </div>
    );
  }

  // Updates local state of entry when typing
  function onEditHandler(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    updateType: "entry" | "song notes",
  ) {
    if (isEditing) {
      switch (updateType) {
        case "entry": {
          setEntryContent(event.target.value);
          break;
        }
        case "song notes": {
          setSongNotes(event.target.value);
          break;
        }
      }
      console.log("Edit made");
    }
  }

  const musicPlayer = useMusicPlayer();

  useBlocker(isEditing);
  
  useEffect(() => {
    // When the entry is unmounted, reset the visual and actual progress of music and pause music.
    return () => {
      const cleanup = async () => {
        if (musicPlayer && musicPlayer.playerModeRef.current === "entry") {
          // Reset on unmount so the reset of the progress bar is not seen by the user while leaving the page.
          await musicPlayer.resetActualProgress();
          musicPlayer.resetVisualProgress("entry");
          await musicPlayer.pause();
        }
      }

      cleanup();
    }
  }, [])

  return (
    <div className="w-9/10 flex flex-col gap-2
      md:px-20 
      lg:px-0 lg:grid lg:grid-cols-[1fr_5fr_3fr] lg:grid-rows-[auto_auto_1fr]">
      <div className="flex flex-col gap-2
        lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:mb-2">
        {/* Date of Entry */}
        <h1 className="text-2xl font-bold">
          {getMonthName(+month!)} {day}, {year}{" "}
        </h1>

        {/* Edit/Cancel + Save buttons */}
        <div className="">
          {buttonsRow}
        </div>
      </div>

      {/* Entry Text Box */}
      <div  className="flex-1
        lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4 mb-2">
        <textarea data-testid="entry-content-text-box"
          className="w-full h-70 resize-none overflow-y-auto rounded border-2 border-blue-400 p-4 focus:border-blue-500 focus:outline-none lg:h-83"
          readOnly={!isEditing}
          name="entry-content"
          id="entry-content"
          value={entryContent}
          onChange={(event) => onEditHandler(event, "entry")}
        ></textarea>
      </div>

      {/* When in edit mode, if the Add Song button is pressed, render the song selection component.  */}
      {/* Song Selection */}
      {(songSelection || isAddSongBtnActive) && 
        <div className="md:px-10 
          lg:px-4 lg:col-start-3 lg:row-start-2">
          <div className="m-auto flex w-fit flex-col gap-2">
            <SongSelection
              isEditing={isEditing}
              isAddSongBtnActive={isAddSongBtnActive}
              setIsAddSongBtnActive={setIsAddSongBtnActive}
              songSelection={songSelection}
              setSongSelection={setSongSelection}
              songNotes={songNotes}
              onEdit={onEditHandler}
              setSongNotes={setSongNotes}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              searchedSongToPlay={searchedSongToPlay}
              setSearchedSongToPlay={setSearchedSongToPlay}
              savedSongSelection={entry ? (entry.songSelection ?? null) : null} // the one in local storage
              unsavedSongSelectionWasChanged={unsavedSongSelectionWasChanged}
              setUnsavedSongSelectionWasChanged={setUnsavedSongSelectionWasChanged}
              checkLoginStatus={checkLoginStatus} 
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
            ></SongSelection>
          </div>
        </div>}
    </div>
  );
}

export default Entry;
