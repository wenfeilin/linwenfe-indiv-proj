import React, { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import PageLayout from "./pages/PageLayout";
import CalendarPage from "./pages/CalendarPage";
import MyJournalPage from "./pages/MyJournalPage";
import EntriesPage from "./pages/EntriesPage";
import DecorationsPage from "./pages/DecorationsPage";
import SettingsPage from "./pages/SettingsPage";
import { EntriesProvider } from "./context/EntriesContext";

/* For API part:
import Message from "./Message";
 */

// This defines the overall page layout.
function App() {

  return (
    <EntriesProvider>
      {/* Set up routes for pages. */}
      <BrowserRouter>
        <Routes>
          {/* All pages will be wrapped by PageLayout so they will have a page header. */}
          <Route path="/" element={<PageLayout />}>
            {/* I'm making the root (the home page) point to the calendar page for now. */}
            <Route index element={<CalendarPage />} />
            <Route path="my-calendar" element={<CalendarPage />} />
            <Route path="my-calendar/:year/:month" element={<CalendarPage />} />
            <Route path="my-journal" element={<MyJournalPage />} />
            <Route path="my-entries" element={<EntriesPage />} />
            <Route path="decorations" element={<DecorationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EntriesProvider>
  );

  /*
  // Uncomment this section to connect to and retrieve data from API.
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    // Fetch message from API and only run on the first render of the component.
    fetch("/api/messages")
      .then((response) => response.text())
      .then((text) => setMessage(text));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <Message />
      <h2 className="text-red-500">Hi</h2>
    </div>
  );
  */
}

export default App;
