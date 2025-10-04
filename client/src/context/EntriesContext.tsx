import { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

// Structure of an entry
type Entry = {
  id: string;
  date: string;
  content: string;
  // songSelection: Song | null
  songNotes: string;
};

// Define the structure for an Action for the reducer.
type Action =
  | { type: "upsertEntry"; payload: Entry } // entry to be added
  | { type: "deleteEntry"; payload: { id: string } }; // the id of the entry being deleted

// Create a context to store the list of entries (to avoid prop drilling the actions and to store
// data in a single place = single source of truth). Entries are initially empty.
const EntriesContext = createContext<Entry[]>([]);

// Create a context to store the actions (to avoid prop drilling the actions). Action is be
// initially be undefined when user hasn't done anything.
const EntriesDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined,
);

// This is a custom wrapper component for the EntriesContext (so it's less bulky when used)
export function EntriesProvider({ children }: { children: ReactNode }) {
  // Initially, the list of entries is empty.
  const [entries, dispatch] = useReducer(entriesReducer, []);

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
function entriesReducer(entries: Entry[], action: Action): Entry[] {
  switch (action.type) {
    case "upsertEntry": {
      const newEntry = action.payload;
      const entryIds = entries.map((entry) => entry.id);

      // Update the entry if it already exists in the list
      if (entryIds.includes(newEntry.id)) {
        return entries.map((entry) =>
          entry.id === newEntry.id ? newEntry : entry,
        );
      } else {
        // Add the entry to the list if it is entirely new
        return [...entries, newEntry];
      }
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
