// Providers helper functions (Router, Entries context)

import React from "react";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { EntriesProvider, EntryType } from "../src/contexts/EntriesContext";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";

// Helper component to render the URL to be tested.
function LocationDisplay() {
  const location = useLocation();
  
  return (
    <div data-testid="location-display">
      {location.pathname}
    </div>
  )
}

// Initial "context" of test
type RenderOptions = {
  route?: string;
  routeHistory?: string[];
  initialEntries?: EntryType[];
}

// Render component with router and entries context (mocking the two for testing). By default, there are 0 entries.
export function renderWithRouterAndEntries(ui: ReactNode, options: RenderOptions = {}) {
  // By default, the route points to the homepage.
  const { route = "/", routeHistory = [route], initialEntries = []} = options;

  return render(
    // initialEntries is a prop for the initial routing state = navigation history stack
    <EntriesProvider initialEntries={initialEntries}>
      <MemoryRouter initialEntries={routeHistory}>
        {/* Renders the URL for all routes */}
        <LocationDisplay />
        {/* Include Routes and Route for URL pattern matching and path parameters */}
        <Routes>
          <Route path="/" element={ui}>
            <Route index element={ui} />
            <Route path="my-calendar" element={ui} />
            <Route path="my-calendar/:year/:month" element={ui} />
            <Route path="entry/:year/:month/:day" element={ui} />
            <Route path="my-journal" element={ui} />
            <Route path="my-entries" element={ui} />
            <Route path="decorations" element={ui} />
            <Route path="settings" element={ui} />
          </Route>
        </Routes>
      </MemoryRouter>
    </EntriesProvider>
  )
}