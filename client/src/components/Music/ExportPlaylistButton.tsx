import { useEntries } from "../../contexts/EntriesContext";
import { getDateParts, getMonthName } from "../../utils/date";

function ExportPlaylistButton({ setPlaylistUrl, selectedMonth, setShowExportPlaylistMsg } : { setPlaylistUrl: (playlistUrl: string) => void, selectedMonth: Date | null, setShowExportPlaylistMsg: (showExportPlaylistMsg: boolean) => void }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const entries = useEntries();

  async function createPlaylist(month: number, year: number) {
    const thisMonthEntries = entries.filter((entry) => {
      const [entryYear, entryMonth] = getDateParts(entry.date);
      return entryYear === year && entryMonth === month;
    })
    

    const thisMonthSongUris = thisMonthEntries.map((entry) => entry.songSelection?.uri ?? "");

    const hasNoSongs = thisMonthSongUris.every((songUri) => songUri === "");

    if (hasNoSongs) {
      setPlaylistUrl("N/A");
      setShowExportPlaylistMsg(true);
      return; // should indicate to the parent component that there are no songs to be exported.
    }

    const monthName = getMonthName(month);

    try {
      const reqBody = {
        month: monthName,
        year: year,
        songUris: thisMonthSongUris,
      }

      // Create a new playlist with the selected month's songs.
      const response = await fetch(`${apiUrl}/playlists/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody),
        credentials: "include",
      });

      const data = await response.json();
      const playlistSpotifyUrl = `https://open.spotify.com/playlist/${data.playlistId}`;

      setPlaylistUrl(playlistSpotifyUrl);
      setShowExportPlaylistMsg(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      className="text-white bg-green-500 px-4 py-1 rounded-lg hover:cursor-pointer hover:bg-green-600 mr-2 lg:mr-0 lg:flex-1"
      onClick={() => {
        if (!selectedMonth) {
          return;
        }
        
        const month = selectedMonth?.getMonth() + 1;
        const year = selectedMonth?.getFullYear();
       
        createPlaylist(month, year);
      }}
    >
      Export
    </button>
  );
}

export default ExportPlaylistButton;
