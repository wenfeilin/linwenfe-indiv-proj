import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PageLayout from "./pages/PageLayout";
import CalendarPage from "./pages/CalendarPage";
import EntryPage from "./pages/EntryPage";
import EntriesPage from "./pages/EntriesPage";
import SpotifyLoginPage from "./pages/SpotifyLoginPage";
import { EntriesProvider } from "./contexts/EntriesContext";
import { useEffect, useState } from "react";
import GlobalPlayer from "./components/Music/GlobalPlayer";
import ConditionalMusicProvider from "./components/Music/ConditionalMusicProvider";

// This defines the overall page layout.
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedInVal = localStorage.getItem("isSpotifyLoggedIn");
    return isLoggedInVal? JSON.parse(isLoggedInVal) : false;
  });
  
  async function checkLoginStatus(setIsLoggedIn: (isLoggedIn: boolean) => void) {
    // const params = new URLSearchParams(window.location.search);

    // // Check if access was denied by user on mount (this page gets mounted/redirected to if the login btn was pressed)
    // if (params.get("auth_denied")) {
    //   // Update login status
    //   setIsLoggedIn(false);
    //   console.log("user denied access");
    //   console.log(isLoggedIn);
    //   // Reset the URL
    //   // window.history.replaceState({}, "", window.location.pathname);
    //   return;

    // }

    // console.log("trying to fetch auth status")

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
  
  // Check login status on mount.
  useEffect(() => {
    checkLoginStatus(setIsLoggedIn);
  }, []);

  console.log(isLoggedIn);

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
  // let isOnCalendarPg = false;
  
  // To not render the player or the calendar if the latter is not loaded yet.
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  // Change styles of calendar player depending on which page the user is on.
  if (path.includes("calendar")) {
    containerStyles = "w-full md:w-3/4 lg:w-1/2 px-3";
    parentContainerStyles = "order-last col-start-2 flex flex-col items-center";
    // isOnCalendarPg = true;
  } else {
    // Centered and a reasonable size (not too long)
    containerStyles = "w-full md:w-3/4 lg:w-1/2 px-3";
    parentContainerStyles = "flex flex-col items-center";
  }

  return (
    // Set up single global music player.
    <ConditionalMusicProvider isLoggedIn={isLoggedIn}>
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
                  <Route path="spotify-login" element={<SpotifyLoginPage /*checkLoginStatus={checkLoginStatus} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}*/ />} />
                  {/* <Route path="my-journal" element={<MyJournalPage />} />
                  <Route path="decorations" element={<DecorationsPage />} />
                  <Route path="settings" element={<SettingsPage />} /> */}
                </Route>
              </Routes>
            </div>

            {/* Place calendar player outside router's route tree so it doesn't unmount when the route changes since for every new route, components are recreated. */}
            {isLoggedIn &&
              (<div className={`${parentContainerStyles}`}>
                <GlobalPlayer containerStyles={`${containerStyles}`}/>
              </div>)}

          </div>

        </BrowserRouter>
      </EntriesProvider>
    </ConditionalMusicProvider>
  );
}

export default App;
