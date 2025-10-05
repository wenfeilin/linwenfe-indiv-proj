import { useState, useContext } from 'react';
import { useEntries, useEntriesDispatch } from '../../context/EntriesContext';
import type { SongSelection } from './SongSelection';

// The entry content (entry and song selection)
function Entry({year, month, day}: {year: number, month: number, day: number}) {
  const entries = useEntries();

  // For now, the entry's content will be saved here, but this should be moved to the Edit button
  // action later when that is made.
  const dispatch = useEntriesDispatch()!;
  
  const currEntry = entries.find((entry) => entry.date === `${year}-${month}-${day}`);

  const [entryContent, setEntryContent] = useState(currEntry? currEntry.content : ""); // to save edits
  // const [songSelection, setSongSelection] = useState(); // for later

  const entryContentBeforeEdit = entryContent;
  
  return(
    <div className="h-full">
      <textarea className="border-2 border-blue-400 rounded focus:outline-none 
      focus:border-blue-500 w-2/3 h-2/3" name="entry-content" id="entry-content"
      value={entryContent} onChange={(event) => {
        // Update the state of the text box's content with each edit. (Do this for now. Change 
        // later when the edit btn is implemented.)
        setEntryContent(event.target.value); // btw this is an async process?

        if (entryContentBeforeEdit === "" && event.target.value !== "") { // have to change this later when considering existence of song selection
          // Create the entry if content is added (to an "empty"/nonexistent entry).
          const newEntry = {
            id: crypto.randomUUID(),
            date: `${year}-${month}-${day}`,
            content: event.target.value,
            songNotes: "" // for now
          }

          dispatch({type: "createEntry", payload: newEntry});
          console.log("Created.")
        } else if (entryContentBeforeEdit !== "" && event.target.value !== "") {
          // Update the entry if the content is still there but just changed.
          const entryToUpdate = entries.find((entry) => entry.date === `${year}-${month}-${day}`)!;
          dispatch({type: "updateEntry", payload: {id: entryToUpdate.id, content: event.target.value}});
          console.log("Updated")
        } else {
          // Remove the entry if all content was deleted.
          const entryToDelete = entries.find((entry) => entry.date === `${year}-${month}-${day}`)!;
          dispatch({type: "deleteEntry", payload: {id: entryToDelete.id}});
          console.log("Deleted");
        }
      }}></textarea>

      {/* Song Selection */}
      
    </div>
  );
}

export default Entry;