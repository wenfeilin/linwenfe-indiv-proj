import { useParams } from "react-router";
import {
  useEntriesDispatch,
  type EntryType,
} from "../../contexts/EntriesContext";
import type { MouseEventHandler } from "react";
import type { Song } from "../Music/SongSelection";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import SongSelection from "../Music/SongSelection";

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
  setSearchedSongToPlay,
  unsavedSongSelectionWasChanged,
}: {
  newEntryContent: string;
  entryBeingSaved: EntryType | undefined;
  newSongSelection: Song | null;
  newSongNotes: string;
  setIsAddSongBtnActive: any,
  onSave: MouseEventHandler<HTMLButtonElement>;
  setIsSearching: (arg0: boolean) => void;
  setSearchedSongToPlay: (searchedSongToPlay: Song | null) => void;
  unsavedSongSelectionWasChanged: boolean;
}) {
  const dispatch = useEntriesDispatch()!;

  const { year, month, day } = useParams();
  const entryDate = `${year}-${month}-${day}`;

  const musicPlayer = useMusicPlayer();

  return (
    <>
      <button
        className="rounded-md bg-green-500 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-green-600"
        onClick={async (event) => {
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

          // Determine whether song being played should be paused or not after saving.
          // Only stop playing music if the song being played is not the song selection before edit.
          if (musicPlayer) {
            const prevSavedSongSelectionUri = entryBeingSaved?.songSelection?.uri;
            const newSongSelectionUri = newSongSelection?.uri;
            const currentlyPlayingSongUri = musicPlayer.currentContext?.uri;

            // If what is playing right now is not what was previously selected OR a song that was selected (but not saved yet) is not the same as the one being played right now, pause the music. (In all other cases, let the song play because it should be the same song being played before and after save, so no need to pause it. I am assuming this is a preference users would have.) <-- THIS IS AN OLD COMMENT (I'M TOO LAZY TO UPDATE IT TO MATCH THE NEW IF STATEMENT CONDITION -- DO LATER)

            console.log("prev song", prevSavedSongSelectionUri)
            console.log("new song", newSongSelectionUri)

            if ((newSongSelectionUri === prevSavedSongSelectionUri && prevSavedSongSelectionUri !== currentlyPlayingSongUri) || newSongSelectionUri !== currentlyPlayingSongUri) {
              await musicPlayer.pause();
              await musicPlayer.resetProgress("entry");
            }
          }

          // Assuming there's no song selection for the entry, reset the song the mini player shows.
          if ((entryBeingSaved !== undefined && !entryBeingSaved.songSelection) || newSongSelection === null) {
            setSearchedSongToPlay(null);
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
