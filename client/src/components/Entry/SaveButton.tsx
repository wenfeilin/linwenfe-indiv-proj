import { useParams } from "react-router";
import {
  useEntriesDispatch,
  type EntryType,
} from "../../contexts/EntriesContext";
import type { MouseEventHandler } from "react";
import type { Song } from "../Music/SongSelection";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

// Determines if changes were made and if so saves, updating the entries list context and updates
// local storage too. Otherwise, doesn't update the entries list context.
function SaveButton({
  newEntryContent,
  newSongSelection,
  newSongNotes,
  entryBeingSaved,
  setIsAddSongBtnActive,
  onSave,
  setIsSearching,
}: {
  newEntryContent: string;
  entryBeingSaved: EntryType | undefined;
  newSongSelection: Song | null;
  newSongNotes: string;
  setIsAddSongBtnActive: any,
  onSave: MouseEventHandler<HTMLButtonElement>;
  setIsSearching: (arg0: boolean) => void;
}) {
  const dispatch = useEntriesDispatch()!;

  const { year, month, day } = useParams();
  const entryDate = `${year}-${month}-${day}`;

  const musicPlayer = useMusicPlayer();

  return (
    <>
      <button
        className="rounded-md bg-green-500 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-green-600"
        onClick={(event) => {
          // If changes are being saved, update the entry in the entries list.
          if (
            entryBeingSaved === undefined &&
            (newEntryContent !== "" ||
              newSongSelection !== null ||
              newSongNotes !== "")
          ) {
            // Create new entry since content has been added to it.
            dispatch({
              type: "createEntry",
              payload: {
                id: crypto.randomUUID(),
                date: entryDate,
                content: newEntryContent,
                songSelection: newSongSelection,
                songNotes: newSongNotes,
              },
            });

            console.log("Created permanently!");
          } else if (
            entryBeingSaved !== undefined &&
            newEntryContent === "" &&
            newSongSelection === null &&
            newSongNotes === ""
          ) {
            // Delete entry since all of its contents were deleted.
            dispatch({
              type: "deleteEntry",
              payload: {
                id: entryBeingSaved.id,
              },
            });

            console.log("Deleted permanently!");
          } else if (
            entryBeingSaved !== undefined &&
            (newEntryContent !== entryBeingSaved.content ||
              newSongSelection !== entryBeingSaved.songSelection ||
              newSongNotes !== entryBeingSaved.songNotes)
          ) {
            // Update entry since its content has been changed.
            dispatch({
              type: "updateEntry",
              payload: {
                id: entryBeingSaved.id,
                content: newEntryContent,
                songSelection: newSongSelection ?? null,
                songNotes: newSongNotes,
              },
            });

            console.log("Updated permanently!");
          }
          onSave(event);

          // Stop music from playing if any.
          if (musicPlayer && musicPlayer.isPlaying) {
            musicPlayer.togglePlay();
          }

          // Hides the add song search form / makes the player uneditable upon save.
          setIsAddSongBtnActive(false);
          setIsSearching(false);
        }}
      >
        Save
      </button>
    </>
  );
}

export default SaveButton;
