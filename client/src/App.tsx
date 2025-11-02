import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import PageLayout from "./pages/PageLayout";
import CalendarPage from "./pages/CalendarPage";
import EntryPage from "./pages/EntryPage";
import MyJournalPage from "./pages/MyJournalPage";
import EntriesPage from "./pages/EntriesPage";
import DecorationsPage from "./pages/DecorationsPage";
import SettingsPage from "./pages/SettingsPage";
import SpotifyLoginPage from "./pages/SpotifyLoginPage";
import { EntriesProvider } from "./contexts/EntriesContext";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import { useEffect, useState } from "react";
import GlobalSpotifyPlayer from "./components/Music/GlobalSpotifyPlayer";

// This defines the overall page layout.
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedInVal = localStorage.getItem("isSpotifyLoggedIn");
    return isLoggedInVal? JSON.parse(isLoggedInVal) : false;
  });
  
  async function checkLoginStatus(setIsLoggedIn: (isLoggedIn: boolean) => void) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const authStatus = await response.json();
      
      // console.log("Fetch was called.");
      
      setIsLoggedIn(authStatus.isLoggedIn);
      // console.log("is logged in?", authStatus.isLoggedIn);
    } catch (err) {
      console.log(err);
    }
  }
  
  // Check login status on every re-render.
  useEffect(() => {
    checkLoginStatus(setIsLoggedIn);
  });

  // For when the app is reloaded.
  useEffect(() => {
    localStorage.setItem("isSpotifyLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  // By default, the root and my-calendar routes should redirect user to the calendar for current month and year.
  const now = new Date();
  const currMonth = now.getMonth() + 1; // .getMonth() returns 0-based months.
  const currYear = now.getFullYear();


  // Determine what page the user is on.
  const path = window.location.pathname;

  let containerStyles = "";
  let parentContainerStyles = ""
  let isOnCalendarPg = false;
  
  // To not render the player or the calendar if the latter is not loaded yet.
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  // Change styles of calendar player depending on which page the user is on.
  if (path.includes("calendar")) {
    containerStyles = "w-full md:w-3/4 lg:w-1/2 px-3";
    parentContainerStyles = "order-last col-start-2 flex flex-col items-center";
    isOnCalendarPg = true;
  } else {
    // Centered and a reasonable size (not too long)
    containerStyles = "w-full md:w-3/4 lg:w-1/2 px-3";
    parentContainerStyles = "flex flex-col items-center";
  }

  return (
    // Set up single global music player.
    <MusicPlayerProvider>
      <EntriesProvider>
        {/* Set up routes for pages. */}
        <BrowserRouter>

          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Routes>
                {/* All pages will be wrapped by PageLayout so they will have a page header. */}
                <Route path="/" element={<PageLayout />}>
                  {/* I'm making the root (the home page) point to the spotify login page. */}
                  <Route index element={<Navigate to={`/spotify-login`} />} />
                  <Route path="my-calendar" element={<Navigate to={`/my-calendar/${currYear}/${currMonth}`} />} />
                  <Route path="my-calendar/:year/:month" element={<CalendarPage checkLoginStatus={checkLoginStatus} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} isCalendarLoading={isCalendarLoading} setIsCalendarLoading={setIsCalendarLoading} />} />
                  <Route path="entry/:year/:month/:day" element={<EntryPage checkLoginStatus={checkLoginStatus} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
                  <Route path="my-entries" element={<EntriesPage />} />
                  <Route path="spotify-login" element={<SpotifyLoginPage checkLoginStatus={checkLoginStatus} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
                  {/* <Route path="my-journal" element={<MyJournalPage />} />
                  <Route path="decorations" element={<DecorationsPage />} />
                  <Route path="settings" element={<SettingsPage />} /> */}
                </Route>
              </Routes>
            </div>

            {/* Place calendar player outside router's route tree so it doesn't unmount when the route changes since for every new route, components are recreated. */}
            {isLoggedIn && (isOnCalendarPg? !isCalendarLoading: true) &&
              (<div className={`${parentContainerStyles}`}>
                <GlobalSpotifyPlayer containerStyles={`${containerStyles}`}/>
              </div>)}

          </div>

        </BrowserRouter>
      </EntriesProvider>
    </MusicPlayerProvider>
  );
}

 /*
  Place calendar player here so it doesn't get unmounted on route changes
        {isLoggedIn && (isOnCalendarPg? !isCalendarLoading: true) &&
          (<div className={`${parentContainerStyles}`}>
            <GlobalSpotifyPlayer containerStyles={`${containerStyles}`}/>
          </div>)}
  */

export default App;
