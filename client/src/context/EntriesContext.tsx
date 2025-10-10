import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";
import type { Song } from "../components/Entry/SongSelection";

// All context and reducer wiring is in here!

// Structure of an entry
export type EntryType = {
  id: string;
  date: string; // in the form "year-month-day"
  content: string;
  songSelection: Song | null
  songNotes: string;
};

// Define the structure for an Action for the reducer.
type Action =
  | { type: "createEntry"; payload: EntryType }
  | { type: "updateEntry"; payload: { id: string, content: string, songSelection: Song | null, songNotes: string }} // entry to be added
  | { type: "deleteEntry"; payload: { id: string } }; // the id of the entry being deleted

// Create a context to store the list of entries (to avoid prop drilling the actions and to store
// data in a single place = single source of truth). Entries are initially empty.
// Represents the stored version of all entries.
const EntriesContext = createContext<EntryType[]>([]);

// Create a context to store the actions (to avoid prop drilling the actions). Action is be
// initially be undefined when user hasn't done anything.
const EntriesDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined,
);

// This is a custom wrapper component for the EntriesContext (so it's less bulky when used)
export function EntriesProvider({ children }: { children: ReactNode }) {
  // Initially, the list of entries is what is in the local storage.
  const savedEntriesJSON = localStorage.getItem("entries");
  const savedEntries = savedEntriesJSON? JSON.parse(savedEntriesJSON) : [];
  const [entries, dispatch] = useReducer(entriesReducer, savedEntries);

  useEffect(() => {
    // Save this updated list of entries in the local storage too only if any entry was changed.
    // Note: in development mode, this will run twice, which is fine.
    localStorage.setItem("entries", JSON.stringify(entries));
    console.log("Storage updated!");
  }, [entries])

  return (
    // TS requires `.Provider` appended, and b/c JSX is being returned, this should be a .tsx
    // file.
    <EntriesContext.Provider value={entries}>
      <EntriesDispatchContext.Provider value={dispatch}>
        {children}
      </EntriesDispatchContext.Provider>
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  return useContext(EntriesContext);
}

export function useEntriesDispatch() {
  return useContext(EntriesDispatchContext);
}

// The entry list context is only updated when entries are created/edited or deleted.
// Note: reducer should not have side-effects; must stay pure, so it is deterministic!
function entriesReducer(entries: EntryType[], action: Action): EntryType[] {
  switch (action.type) {
    case "createEntry": {
      // Add the entry to the list.
      console.log([...entries, action.payload])
      return [...entries, action.payload];
    }
    case "updateEntry": {
      const entryID = action.payload.id;
      const entryToUpdate = entries.find((entry) => entry.id === entryID)!;

      // Update the entry if it already exists in the list.
      return entries.map((entry) => entry.id === entryID ? {...entryToUpdate, content: action.payload.content, songSelection: action.payload.songSelection, songNotes: action.payload.songNotes } : entry);
    }
    case "deleteEntry": {
      const entryToBeDeleted = action.payload;
      // Remove the entry from the list.
      return entries.filter((entry) => entry.id !== entryToBeDeleted.id);
    }
    default: {
      throw Error("Unknown action: " + (action as any).type);
    }
  }
}
