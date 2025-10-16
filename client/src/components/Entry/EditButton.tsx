import type { MouseEventHandler } from "react";
import type { Song } from "../Music/SongSelection";

function EditButton({
  onEdit,
  setIsAddSongBtnActive,
  songSelection,
}: {
  onEdit: MouseEventHandler<HTMLButtonElement>;
  setIsAddSongBtnActive: (arg0: boolean) => void;
  songSelection: Song | null;
}) {
  return (
    <>
      <button
        className="rounded-md bg-blue-400 px-6.75 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-500"
        onClick={(event) => {
          onEdit(event);
          if (songSelection) {
            setIsAddSongBtnActive(true);
          }
        }}
      >
        Edit
      </button>
    </>
  );
}

export default EditButton;
