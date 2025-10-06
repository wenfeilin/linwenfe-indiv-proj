import type { ChangeEvent, ChangeEventHandler } from "react";

export type Song = {
  // id: ??
  title: string;
  // artist: string;
  // albumCover: ??
};

function SongSelection({ isDisabled, onEdit }: {isDisabled: boolean, onEdit: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, updateType: "entry" | "song" | "song notes") => void}) {
  return (
    <>
      <input
        type="text"
        id="song"
        placeholder="Song Title - Artist"
        readOnly={isDisabled}
        className="rounded border-2 border-blue-300 focus:border-blue-400 focus:outline-none px-1.5"
        onChange={(event) => onEdit(event, "song")}
      />

      {/* Song Notes */}
      <textarea
        name="song-notes"
        id="song-notes"
        placeholder="Song Notes"
        readOnly={isDisabled}
        className="resize-none overflow-y-auto rounded border-2 border-blue-300 p-1.5 focus:border-blue-400 focus:outline-none"
        onChange={(event) => onEdit(event, "song notes")}
      ></textarea>
    </>
  );
}

export default SongSelection;
