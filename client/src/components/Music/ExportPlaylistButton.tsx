import { useEntries } from "../../contexts/EntriesContext";
import { getDateParts, getMonthName } from "../../utils/date";
import type { exportMsgType } from "./ExportPlaylistComponent";

function ExportPlaylistButton({ setPlaylistUrl, selectedMonth, setShowExportPlaylistMsg, setExportPlaylistMsg } : { setPlaylistUrl: (playlistUrl: string) => void, selectedMonth: Date | null, setShowExportPlaylistMsg: (showExportPlaylistMsg: boolean) => void, setExportPlaylistMsg: (msg: exportMsgType | null) => void }) {
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
      setExportPlaylistMsg({
        before: `You don't have any songs to export for ${getMonthName(month)?.slice(0, 3)} ${year}.`,
      }); // Note: using before, linkText, and after in playlist msg b/c no other way to differentiate link from rest of text so that the former can avoid being line broken
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
      setExportPlaylistMsg({
        before: "Your",
        linkText: `${getMonthName(month)?.slice(0, 3)} ${year} playlist`,
        after: "has been created on your Spotify account",
      }); // Note: using before, linkText, and after in playlist msg b/c no other way to differentiate link from rest of text so that the former can avoid being line broken
    } catch (err) {
      console.log(err);
    }
  }

  return (
    // Note: This is the "Export" button after you press "Export Playlist". I am now realizing how confusing it is...
    <button
      className="text-white bg-green-500 px-4 py-1 rounded-lg hover:cursor-pointer hover:bg-green-600 mr-2 
      md:mr-0 md:flex-1"
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
