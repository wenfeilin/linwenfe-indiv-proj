import { useEffect, useState } from "react";
import ExportPlaylistButton from "./ExportPlaylistButton";
import DatePicker from "react-datepicker";
import { getMonthName } from "../../utils/date";
import LoginButton from "./LoginButton";
import { type StyleProps } from "../../utils/types";

// Import datepicker CSS from package
import "react-datepicker/dist/react-datepicker.css";

function ExportPlaylistComponent({ containerStyles = ""}: StyleProps) {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const [showExportPlaylistMsg, setShowExportPlaylistMsg] = useState(false);
  const [isExportPlaylistBtnActive, setIsExportPlaylistBtnActive] =
    useState(false);

  // Repeated login logic from SongSelection.tsx
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedInVal = localStorage.getItem("isSpotifyLoggedIn");
    return isLoggedInVal ? JSON.parse(isLoggedInVal) : false;
  });

  async function checkLoginStatus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const authStatus = await response.json();

      // console.log("Fetch was called.");

      setIsLoggedIn(authStatus.isLoggedIn);
    } catch (err) {
      console.log(err);
    }
  }

  checkLoginStatus();

  useEffect(() => {
    localStorage.setItem("isSpotifyLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  let exportPlaylistResponse;

  if (playlistUrl && selectedMonth) {
    const selectedMonthName = getMonthName(selectedMonth.getMonth() + 1);
    const selectedYr = selectedMonth.getFullYear();

    if (playlistUrl === "N/A") {
      exportPlaylistResponse = (
        <div className="relative">
          <button
            className="absolute -top-1.5 right-1 hover:cursor-pointer p-0.5 text-red-600 font-bold hover:text-red-500"
            onClick={() => setShowExportPlaylistMsg(false)}
          >
            &times;
          </button>
          <p className="bg-blue-100 px-4 py-2 rounded pr-6.5 mb-2 text-sm">
            You don't have any songs to export for {selectedMonthName}{" "}
            {selectedYr}.
          </p>
        </div>
      );
    } else {
      exportPlaylistResponse = (
        <div className="relative">
          <button
            className="absolute -top-1.5 right-1 hover:cursor-pointer p-0.5 text-red-600 font-bold hover:text-red-500"
            onClick={() => setShowExportPlaylistMsg(false)}
          >
            &times;
          </button>
          <p className="bg-blue-100 px-4 py-2 rounded pr-6.5 mb-2 text-sm">
            Your {selectedMonthName} {selectedYr} playlist has been created on
            your Spotify account ({playlistUrl}).
          </p>
        </div>
      );
    }
  }

  return (
    <div className={containerStyles}>
      {!isExportPlaylistBtnActive && (
        <button
          className="rounded-lg bg-blue-400 px-4 py-1 text-gray-100 hover:cursor-pointer hover:bg-blue-500"
          onClick={() => {
            setIsExportPlaylistBtnActive(true);
          }}
        >
          Export Playlist
        </button>
      )}

      {isLoggedIn ? (
        isExportPlaylistBtnActive && (
          <div className="w-auto flex flex-col items-end gap-2">
            <div className="flex flex-col gap-1">
              {/* Date Picker */}
              <DatePicker
                className="rounded border-2 text-center inline-block mt-2"
                selected={selectedMonth}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                onChange={(date) => setSelectedMonth(date)}
              ></DatePicker>
              
              <div className="flex justify-center">
                {/* Export Button */}
                <ExportPlaylistButton
                  setPlaylistUrl={setPlaylistUrl}
                  selectedMonth={selectedMonth}
                  setShowExportPlaylistMsg={setShowExportPlaylistMsg}
                ></ExportPlaylistButton>
                {/* Cancel Button */}
                <button
                  className="text-white rounded-lg bg-gray-400 px-4 py-1 hover:cursor-pointer hover:bg-gray-500"
                  onClick={() => setIsExportPlaylistBtnActive(false)}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Result of Exporting Playlist */}
            {showExportPlaylistMsg && exportPlaylistResponse}
          </div>
        )
      ) : (
        <LoginButton
          isLoggedIn={isLoggedIn}
          checkLoginStatus={checkLoginStatus}
        />
      )}
    </div>
  );
}

export default ExportPlaylistComponent;
