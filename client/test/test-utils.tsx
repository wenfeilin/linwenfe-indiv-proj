// Provides helper functions (Router, Entries context)

import React from "react";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { EntriesProvider, EntryType } from "../src/contexts/EntriesContext";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { MusicPlayerContext, MusicPlayerProvider, MusicPlayerUI } from "../src/contexts/MusicPlayerContext";
import { vi } from "vitest";

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
  musicPlayerValue?: MusicPlayerUI;
}

// Render component with router and entries context (mocking the two for testing). By default, there are 0 entries.
export function renderWithRouterAndEntries(ui: ReactNode, options: RenderOptions = {}) {
  // By default, the route points to the homepage.
  const route = options.route ?? "/";
  const routeHistory = options.routeHistory ?? [route];
  const initialEntries = options.initialEntries ?? [];

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

export type MusicPlayerRenderOptions = {
  musicPlayerValue?: MusicPlayerUI;
}

// Mock music player context value (default value)
export const defaultMusicPlayerVal: MusicPlayerUI = {
  isReady: true, // assume music player is initialized and ready
  isPlaying: false,
  isLoadingSong: false,
  progress: 0,
  trackToPlay: null,
  
  togglePlay: vi.fn(),
  setProgress: vi.fn(),
  setTrackToPlay: vi.fn(),
  
  
  isPlayingGlobal: false,
  progressGlobal: 0,
  isLoadingSongGlobal: false,
  isScrubbingProgressGlobal: { current: false },
  currentSong: null,
  
  togglePlayGlobal: vi.fn(),
  queueAndPlaySongs: vi.fn(),
  setProgressGlobal: vi.fn(),
  setIsLoadingSongGlobal: vi.fn(),
  prevSong: vi.fn(),
  nextSong: vi.fn(),
  
  
  playerModeRef: { current: "entry" },
  isScrubbingProgress: { current: false },
  volume: 50,
  previouslyPlayedModeRef: { current: "entry" }, 
  currentContext: null,
  
  setCurrentContext: vi.fn(),
  pause: vi.fn(),
  seek: vi.fn(),
  setPlayerVolume: vi.fn(),
  updatePlayerState: vi.fn(),
  resetVisualProgress: vi.fn(), 
  resetActualProgress: vi.fn(),
}

// Render component with music player context (mocking it for testing).
export function renderWithMusicPlayer(ui: ReactNode, options: MusicPlayerRenderOptions = {}) {
  // Use default mocked music player value if a custom one isn't passed in.
  const musicPlayerValue = options.musicPlayerValue ?? defaultMusicPlayerVal;

  return render(
    <MusicPlayerContext.Provider value={musicPlayerValue}>
      {ui}
    </MusicPlayerContext.Provider>
  )
}

// Render component with router, entries, and music player context (mocking all three for testing). By default, there are 0 entries.
export function renderWithRouterEntriesMusicPlayer(ui: ReactNode, options: RenderOptions = {}) {
  // By default, the route points to the homepage.
  const route = options.route ?? "/";
  const routeHistory = options.routeHistory ?? [route];
  const initialEntries = options.initialEntries ?? [];

  // Use default mocked music player value if a custom one isn't passed in.
  const musicPlayerValue = options.musicPlayerValue ?? defaultMusicPlayerVal;

  return render(
    // initialEntries is a prop for the initial routing state = navigation history stack
    <EntriesProvider initialEntries={initialEntries}>
      <MusicPlayerContext.Provider value={musicPlayerValue}>
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
      </MusicPlayerContext.Provider>
    </EntriesProvider>
  )
}