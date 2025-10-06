import { useState } from 'react';
import { useEntries } from '../../context/EntriesContext';
import type { SongSelection } from './SongSelection';
import SaveButton from './SaveButton';
import { useParams } from 'react-router';

// The entry content (entry and song selection)
function Entry() {
  const entries = useEntries();
  const { year, month, day } = useParams();

  // Keep track of changes to this local copy of the entry.
  const entryDate = `${year}-${month}-${day}`
  const entry = entries.find((entry) => entry.date === entryDate);

  // Initially render content of entry or nothing if this entry is not filled.
  const [entryContent, setEntryContent] = useState(entry? entry.content : "");
  
  // const [songSelection, setSongSelection] = useState(); // for later

  return(
    <div className="h-full flex flex-col">
      <div className="mb-2">
        <SaveButton newEntryContent={entryContent} entryBeingSaved={entry}></SaveButton>
      </div>
      
      {/* Update the state of the text box's content with each edit. (Do this for now. Change 
      later when the edit btn is implemented.) */}
      <textarea className="border-2 border-blue-400 rounded focus:outline-none 
      focus:border-blue-500 w-2/3 h-2/3" name="entry-content" id="entry-content"
      value={entryContent} onChange={(event) => { // Specifically, remove this onChange prop and move functionality to edit button
        setEntryContent(event.target.value);
      }}></textarea>

      {/* Song Selection */}
      
    </div>
  );
}

export default Entry;