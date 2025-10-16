import { useState, type ChangeEvent } from "react";
import { useEntries } from "../../context/EntriesContext";
import SaveButton from "./SaveButton";
import { useParams } from "react-router";
import EditButton from "./EditButton";
import CancelButton from "./CancelButton";
import { getMonthName } from "../../utils/date";
import SongSelection from "../Music/SongSelection";
import AddSongButton from "./AddSongButton";

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
  const [isSearching, setIsSearching] = useState(songSelection ? false : true);

  console.log(songSelection);

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
        <AddSongButton isAddSongBtnActive={isAddSongBtnActive || (songSelection ? true : false)} setIsAddSongBtnActive={setIsAddSongBtnActive}></AddSongButton>

        {/* Cancel Edits Button */}
        <CancelButton
          onCancel={() => {
            let songSelectionBeforeEdit;

            if (entry !== undefined) {
              songSelectionBeforeEdit = entry.songSelection
                ? entry.songSelection
                : null;
            } else {
              songSelectionBeforeEdit = null;
            }

            // If this entry had something in it prior to editing, check what it's song selection
            // and song notes were.
            // if (entry) {
            //   songSelectionBeforeEdit = entry.songSelection ?? null;
            // }

            setIsEditing(false);
            setIsSearching(false);

            // Reset edits.
            setEntryContent(entry ? entry.content : "");
            setSongSelection(songSelectionBeforeEdit);
            setSongNotes(entry ? entry.songNotes : "");
          }}
        ></CancelButton>

        {/* Save Edits Button */}
        <SaveButton
          newEntryContent={entryContent}
          newSongSelection={songSelection}
          newSongNotes={songNotes}
          entryBeingSaved={entry}
          setIsAddSongBtnActive={setIsAddSongBtnActive}
          onSave={() => setIsEditing(false)}
          setIsSearching={setIsSearching}
        ></SaveButton>
      </div>
    );
  }

  // Updates local state of entry when typing
  function onEditHandler(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    updateType: "entry" | /*"song" |*/ "song notes",
  ) {
    if (isEditing) {
      switch (updateType) {
        case "entry": {
          setEntryContent(event.target.value);
          break;
        }
        /*case "song": {
          const songTitle = event.target.value;
          if (songTitle === "") {
            setSongSelection(null);
          } else {
            setSongSelection({ title: songTitle });
          }
          break;
        }*/
        case "song notes": {
          setSongNotes(event.target.value);
          break;
        }
      }
      console.log("Edit made");
    }
  }

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
      <div className="col-start-2 col-end-5 row-start-2 row-end-4 flex h-full flex-col">
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
        <div className="col-start-5 col-end-6 row-start-2 row-end-3 w-full">
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
            ></SongSelection>
          </div>
        </div>
      {/* )} */}
    </div>
  );
}

export default Entry;
