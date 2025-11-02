import { useEffect, useState } from "react";
import ExportPlaylistButton from "./ExportPlaylistButton";
import DatePicker from "react-datepicker";
import { getMonthName } from "../../utils/date";
import { type StyleProps } from "../../utils/types";

// Import datepicker CSS from package
import "react-datepicker/dist/react-datepicker.css";

export type exportMsgType = {
  before: string,
  linkText?: string,
  after?: string,
}

function ExportPlaylistComponent({ containerStyles = "", checkLoginStatus, setIsLoggedIn, isLoggedIn}: StyleProps & {checkLoginStatus: any, setIsLoggedIn: (isLoggedIn: boolean) => void, isLoggedIn: boolean}) {
  // Check login status since user must be logged in to use majority of music features.
  // Check login status on every re-render.
  useEffect(() => {
    checkLoginStatus(setIsLoggedIn);
  });

  const [playlistUrl, setPlaylistUrl] = useState("");
  // Initialize to current month.
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const [showExportPlaylistMsg, setShowExportPlaylistMsg] = useState(false);
  const [exportPlaylistMsg, setExportPlaylistMsg] = useState<exportMsgType | null>(null);
  const [isExportPlaylistBtnActive, setIsExportPlaylistBtnActive] =
    useState(false);

  let exportPlaylistResponse;

  if (playlistUrl && selectedMonth) {
    if (playlistUrl === "N/A") {
      exportPlaylistResponse = (
        <p className="bg-blue-100 px-4 py-2 rounded pr-6.5 mb-2 text-sm lg:text-left">
          {exportPlaylistMsg?.before}
        </p>
      );
    } else {
      exportPlaylistResponse = (
        <p className="bg-blue-100 px-4 py-2 rounded pr-6.5 mb-2 text-sm lg:text-left">
          {exportPlaylistMsg?.before} <a href={`${playlistUrl}`} target="_blank" className="text-blue-500 hover:text-blue-600 active:underline">{exportPlaylistMsg?.linkText}</a> {exportPlaylistMsg?.after}.
        </p>
      );
    }
  }

  return (
    <div className={containerStyles}>
      {!isExportPlaylistBtnActive && (
        // This button just opens the component -- doesn't do any exporting.
        <button
          className="rounded-lg bg-blue-400 px-4 py-1 text-gray-100 hover:cursor-pointer hover:bg-blue-500 text-[15px] 
            md:text-base md:flex-0 md:px-5
            lg:flex-initial lg:px-4"
          onClick={() => {
            setIsExportPlaylistBtnActive(true);
          }}
        >
          Export Playlist
        </button>
      )}

      {isExportPlaylistBtnActive && (isLoggedIn ? (
        <div className="w-auto flex flex-col text-center gap-2 md:w-3/4">
          <div className="flex flex-col gap-1 mb-1 text-[15px] md:text-base ">
            {/* Date Picker */}
            <div className="">
              <DatePicker
                className="rounded border-2 text-center inline-block md:w-full"
                selected={selectedMonth}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                popperPlacement="left-start"
                popperClassName=""
              
                onChange={(date) => setSelectedMonth(date)}
              ></DatePicker>
            </div>
            
            <div className="flex justify-center 
              md:items-center md:gap-1 md:flex-wrap 
              xl:flex-nowrap">
              {/* Export Button */}
              <ExportPlaylistButton
                setPlaylistUrl={setPlaylistUrl}
                selectedMonth={selectedMonth}
                setShowExportPlaylistMsg={setShowExportPlaylistMsg}
                setExportPlaylistMsg={setExportPlaylistMsg}
              ></ExportPlaylistButton>

              {/* Cancel Button */}
              <button
                className="text-white rounded-lg bg-gray-400 px-4 py-1 hover:cursor-pointer hover:bg-gray-500 md:flex-1"
                onClick={() => {
                  setIsExportPlaylistBtnActive(false);
                  setShowExportPlaylistMsg(false);
                  setSelectedMonth(new Date);
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Result of Exporting Playlist */}
          {showExportPlaylistMsg && exportPlaylistResponse}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mx-4 border-2 p-1 rounded">
          <p className="bg-blue-200 py-1 px-3">Log in to Spotify to use music features</p>

          {/* Cancel Button */}
          <button
            className="text-white rounded-lg bg-gray-400 px-4 py-1 hover:cursor-pointer hover:bg-gray-500 lg:flex-1"
            onClick={() => setIsExportPlaylistBtnActive(false)}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExportPlaylistComponent;
