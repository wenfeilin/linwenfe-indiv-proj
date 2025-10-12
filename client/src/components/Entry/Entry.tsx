import { useState, type ChangeEvent } from "react";
import { useEntries } from "../../context/EntriesContext";
import SaveButton from "./SaveButton";
import { useParams } from "react-router";
import EditButton from "./EditButton";
import CancelButton from "./CancelButton";
import { getMonthName } from "../../utils/date";
import SongSelection from "./SongSelection";
import type { HookHandler } from "vite";

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
    entry ? entry.songSelection : null,
  );
  const [songNotes, setSongNotes] = useState(entry ? entry.songNotes : "");

  const [isEditing, setIsEditing] = useState(false);

  // const [songSelection, setSongSelection] = useState(); // for later

  // Updates local state of entry when typing
  function onEditHandler(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    updateType: "entry" | "song" | "song notes",
  ) {
    if (isEditing) {
      switch (updateType) {
        case "entry": {
          setEntryContent(event.target.value);
          break;
        }
        case "song": {
          const songTitle = event.target.value;
          if (songTitle === "") {
            setSongSelection(null);
          } else {
            setSongSelection({ title: songTitle });
          }
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

  return (
    <div className="grid h-full w-full grid-cols-5 grid-rows-[auto_1fr]">
      <div className="col-start-2 col-end-5 mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {getMonthName(+month!)} {day}, {year}{" "}
        </h1>
        {!isEditing ? (
          <EditButton
            onEdit={() => {
              setIsEditing(true);
            }}
          ></EditButton>
        ) : (
          <div className="flex gap-2">
            <CancelButton
              onCancel={() => {
                let songSelectionBeforeEdit = null;

                if (entry !== undefined) {
                  songSelectionBeforeEdit = entry.songSelection
                    ? entry.songSelection
                    : null;
                }

                setIsEditing(false);

                // Reset edits.
                setEntryContent(entry ? entry.content : "");
                setSongSelection(songSelectionBeforeEdit);
                setSongNotes(entry ? entry.songNotes : "");
              }}
            ></CancelButton>
            <SaveButton
              newEntryContent={entryContent}
              newSongSelection={songSelection}
              newSongNotes={songNotes}
              entryBeingSaved={entry}
              onSave={() => setIsEditing(false)}
            ></SaveButton>
          </div>
        )}
      </div>
      <div className="col-start-2 col-end-5 flex h-full flex-col">
        <textarea
          className="h-2/3 resize-none overflow-y-auto rounded border-2 border-blue-400 p-4 focus:border-blue-500 focus:outline-none"
          readOnly={!isEditing}
          name="entry-content"
          id="entry-content"
          value={entryContent}
          onChange={(event) => onEditHandler(event, "entry")}
        ></textarea>
      </div>

      {/* Song Selection */}
      <div className="col-start-5 col-end-6 w-full justify-self-end">
        <div className="m-auto flex w-2/3 flex-col gap-2">
          <SongSelection
            isDisabled={!isEditing}
            songSelection={songSelection}
            songNotes={songNotes}
            onEdit={onEditHandler}
          ></SongSelection>
        </div>
      </div>
    </div>
  );
}

export default Entry;
