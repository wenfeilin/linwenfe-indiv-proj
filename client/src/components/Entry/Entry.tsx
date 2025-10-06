import { useState } from "react";
import { useEntries } from "../../context/EntriesContext";
import type { SongSelection } from "./SongSelection";
import SaveButton from "./SaveButton";
import { useParams } from "react-router";
import EditButton from "./EditButton";
import CancelButton from "./CancelButton";

// The entry content (entry and song selection)
function Entry() {
  const entries = useEntries();
  const { year, month, day } = useParams();

  // Keep track of changes to this local copy of the entry.
  const entryDate = `${year}-${month}-${day}`;
  const entry = entries.find((entry) => entry.date === entryDate);

  // Initially render content of entry or nothing if this entry is not filled.
  const [entryContent, setEntryContent] = useState(entry ? entry.content : "");

  const [isEditing, setIsEditing] = useState(false);
  const [editCanceled, setEditCanceled] = useState(false);

  // const [songSelection, setSongSelection] = useState(); // for later

  return (
    <div className="flex h-full flex-col">
      {!isEditing ? (
        <div className="mb-2">
          <EditButton onEdit={() => {
            setIsEditing(true)
            setEditCanceled(false);
            }}></EditButton>
        </div>
      ) : (
        <div className="mb-2">
          <CancelButton onCancel={() => {
            setIsEditing(false);
            setEditCanceled(true);

            // Reset edits.
            setEntryContent(entry? entry.content : "");
            }}></CancelButton>
          <SaveButton
            newEntryContent={entryContent}
            entryBeingSaved={entry}
            onSave={() => setIsEditing(false)}
          ></SaveButton>
        </div>
      )}

      <textarea
        className="h-2/3 w-2/3 rounded border-2 border-blue-400 focus:border-blue-500 focus:outline-none"
        readOnly={!isEditing}
        name="entry-content"
        id="entry-content"
        value={entryContent}
        onChange={(event) => {
          if (isEditing) {
            setEntryContent(event.target.value);
            console.log("Edit made")
          }
        }}
      ></textarea>

      {/* Song Selection */}
    </div>
  );
}

export default Entry;
