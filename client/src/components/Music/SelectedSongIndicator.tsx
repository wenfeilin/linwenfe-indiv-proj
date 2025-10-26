import type { Song } from "./SongSelection";

function SelectedSongIndicator({songSelection}: {songSelection: Song | null}) {
  const selectedSongTitle = songSelection? `${songSelection.title} by ${songSelection.artists}` : "none"

  return (
    <p className="text-sm"><span className="font-bold">Selected (unsaved)</span>: {selectedSongTitle}</p>
  )
}

export default SelectedSongIndicator;