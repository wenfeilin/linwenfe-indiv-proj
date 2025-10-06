// export type Song = {
//   // id: ??
//   title: string;
//   artist: string;
//   // albumCover: ??
// };

function SongSelection({ isDisabled }: {isDisabled: boolean}) {
  return (
    <>
      <input
        type="text"
        id="song"
        placeholder="Song Title - Artist"
        readOnly={isDisabled}
        className="rounded border-2 border-blue-300 focus:border-blue-400 focus:outline-none px-1.5"
      />

      {/* Song Notes */}
      <textarea
        name="song-notes"
        id="song-notes"
        placeholder="Song Notes"
        readOnly={isDisabled}
        className="resize-none overflow-y-auto rounded border-2 border-blue-300 p-1.5 focus:border-blue-400 focus:outline-none"
      ></textarea>
    </>
  );
}

export default SongSelection;
