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
function Entry() {
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
  const [isAddSongBtnActive, setIsAddSongBtnActive] = useState(entry?.songSelection ? true : false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchedSongToPlay, setSearchedSongToPlay] = useState(songSelection);

  const [unsavedSongSelectionWasChanged, setUnsavedSongSelectionWasChanged] = useState(false);

  // console.log("This entry's song selection is", songSelection?.title);

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
      <div className="flex gap-2">
        {/* Add Song Button */}
        <AddSongButton isAddSongBtnActive={isAddSongBtnActive || (songSelection ? true : false)} setIsAddSongBtnActive={setIsAddSongBtnActive} setIsSearching={setIsSearching}></AddSongButton>

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
                musicPlayer.resetProgress("entry");
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
          musicPlayer.resetProgress("entry");
          await musicPlayer.pause();
        }
      }

      cleanup();
    }
  }, [])

  return (
    <div className="grid h-full w-full grid-cols-5 grid-rows-[auto_auto_1fr]">
      <div className="col-start-2 col-end-5 row-start-1 mb-2 flex items-center justify-between">
        {/* Date of Entry */}
        <h1 className="text-2xl font-bold">
          {getMonthName(+month!)} {day}, {year}{" "}
        </h1>

        {/* Edit/Cancel + Save buttons */}
        {buttonsRow}
      </div>

      {/* Entry Text Box */}
      {/* Change col-end back to 5 */}
      <div className="col-start-2 col-end-4 row-start-2 row-end-4 flex h-full flex-col">
        <textarea
          className="h-2/3 resize-none overflow-y-auto rounded border-2 border-blue-400 p-4 focus:border-blue-500 focus:outline-none"
          readOnly={!isEditing}
          name="entry-content"
          id="entry-content"
          value={entryContent}
          onChange={(event) => onEditHandler(event, "entry")}
        ></textarea>
      </div>


      {/* When in edit mode, if the Add Song button is pressed, render the song selection component.  */}
      {/* {isAddSongBtnActive && ( */}
        {/* Song Selection */}
        {/* Change col-start back to 5 */}
        <div className="col-start-4 col-end-6 row-start-2 row-end-4 w-full">
          <div className="m-auto flex w-4/5 flex-col gap-2">
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
            ></SongSelection>
          </div>
        </div>
      {/* )} */}
    </div>
  );
}

export default Entry;
