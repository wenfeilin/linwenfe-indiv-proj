import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PageLayout from "./pages/PageLayout";
import CalendarPage from "./pages/CalendarPage";
import EntryPage from "./pages/EntryPage";
import MyJournalPage from "./pages/MyJournalPage";
import EntriesPage from "./pages/EntriesPage";
import DecorationsPage from "./pages/DecorationsPage";
import SettingsPage from "./pages/SettingsPage";
import { EntriesProvider } from "./contexts/EntriesContext";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";

/* For API part:
import Message from "./Message";
 */

// This defines the overall page layout.
function App() {
  // By default, the root and my-calendar routes should redirect user to the calendar for current month and year.
  const now = new Date();
  const currMonth = now.getMonth() + 1; // .getMonth() returns 0-based months.
  const currYear = now.getFullYear();

  return (
    // Set up single global music player.
    <MusicPlayerProvider>
      <EntriesProvider>
        {/* Set up routes for pages. */}
        <BrowserRouter>
          <Routes>
            {/* All pages will be wrapped by PageLayout so they will have a page header. */}
            <Route path="/" element={<PageLayout />}>
              {/* I'm making the root (the home page) point to the calendar page for now. */}
              <Route index element={<Navigate to={`/my-calendar/${currYear}/${currMonth}`} />} />
              <Route path="my-calendar" element={<Navigate to={`/my-calendar/${currYear}/${currMonth}`} />} />
              <Route path="my-calendar/:year/:month" element={<CalendarPage />} />
              <Route path="entry/:year/:month/:day" element={<EntryPage />} />
              <Route path="my-journal" element={<MyJournalPage />} />
              <Route path="my-entries" element={<EntriesPage />} />
              <Route path="decorations" element={<DecorationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EntriesProvider>
    </MusicPlayerProvider>
  );
}

export default App;
