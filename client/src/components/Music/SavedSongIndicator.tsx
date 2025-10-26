import type { Song } from "./SongSelection";

function SavedSongIndicator({savedSongSelection}: {savedSongSelection: Song | null}) {
  const savedSongTitle = savedSongSelection? `${savedSongSelection.title} by ${savedSongSelection.artists}` : "none"

  return (
    <p className="text-sm"><span className="font-bold">Saved</span>: {savedSongTitle}</p>
  )
}

export default SavedSongIndicator;