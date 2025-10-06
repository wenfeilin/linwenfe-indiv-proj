import { useParams } from "react-router";
import { useEntriesDispatch, type EntryType } from "../../context/EntriesContext";

// Determines if changes were made and if so saves, updating the entries list context and updates 
// local storage too. Otherwise, doesn't update the entries list context. 
function SaveButton({newEntryContent, entryBeingSaved}: {newEntryContent: string, entryBeingSaved: EntryType | undefined}) {
  const dispatch = useEntriesDispatch()!;

  const { year, month, day } = useParams();
  const entryDate = `${year}-${month}-${day}`

  return (
    <>
      <button className="bg-blue-400 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-500 hover:cursor-pointer" onClick={(event) => {
        // If changes are being saved, update the entry in the entries list.
        if (entryBeingSaved === undefined && newEntryContent !== "") {
          // Create new entry since content has been added to it.
          dispatch({
            type: "createEntry",
            payload: {
              id: crypto.randomUUID(),
              date: entryDate,
              content: newEntryContent,
              songNotes: "" // for now
            }
          });

          console.log("Created permanently!");
        } else if (entryBeingSaved !== undefined && newEntryContent === "") {
          // Delete entry since all of its contents were deleted.
          dispatch({
            type: "deleteEntry",
            payload: {
              id: entryBeingSaved.id,
            }
          });

          console.log("Deleted permanently!");
        } else if (entryBeingSaved !== undefined && newEntryContent !== entryBeingSaved.content) {
          // Update entry since its content has been changed.
          dispatch({
            type: "updateEntry",
            payload: {
              id: entryBeingSaved.id,
              content: newEntryContent
            }
          });

          console.log("Updated permanently!");
        }
      }}>Save</button>
    </>
  )
}

export default SaveButton;