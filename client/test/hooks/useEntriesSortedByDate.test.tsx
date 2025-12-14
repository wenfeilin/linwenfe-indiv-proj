import React from "react";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../test-utils"
import "@testing-library/jest-dom/vitest";
import useEntriesSortedByDate from "../../src/hooks/useEntriesSortedByDate";
import { EntriesProvider, EntryType } from "../../src/contexts/EntriesContext";

describe("useEntriesSortedByDate hook", () => {
  it("sorts entries w/ mix of dates from least to most recent", () => {
    // Mock entries (three).
    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-10-2",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2022-11-2",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });
    
    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(3);

    // Assert the sorted entries order
    expect(sortedEntries[0].id).toBe("3");
    expect(sortedEntries[1].id).toBe("1");
    expect(sortedEntries[2].id).toBe("2");
  });

  it("sorts entries w/ same year but diff month", () => {
    // Mock entries (three).
    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-8-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-2-2",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2025-5-2",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });
    
    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(3);

    // Assert the sorted entries order
    expect(sortedEntries[0].id).toBe("2");
    expect(sortedEntries[1].id).toBe("3");
    expect(sortedEntries[2].id).toBe("1");
  });

  it("sorts entries w/ same year and month but diff day", () => {
    // Mock entries (three).
    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-29",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2025-10-15",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2025-10-3",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });
    
    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(3);

    // Assert the sorted entries order
    expect(sortedEntries[0].id).toBe("3");
    expect(sortedEntries[1].id).toBe("2");
    expect(sortedEntries[2].id).toBe("1");
  });

  it("sorts already sorted entries", () => {
    // Mock entries (three).
    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2022-11-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      },
      {
        id: "2",
        date: "2023-10-2",
        content: "",
        songSelection: {
          id: "425425",
          uri: "uri",
          album: "some Fall album",
          albumCoverUrls: ["cover"],
          title: "October October",
          artists: "Fall guy",
          durationMS: 24000,

        },
        songNotes: "",
      },
      {
        id: "3",
        date: "2023-11-5",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });
    
    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(3);

    // Assert the sorted entries order
    expect(sortedEntries[0].id).toBe("1");
    expect(sortedEntries[1].id).toBe("2");
    expect(sortedEntries[2].id).toBe("3");
  });

  it("sorts one entry by returning it", () => {
    // Mock entries (one).
    const mockEntriesToRender: EntryType[] = [
      {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      }
    ];

    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });

    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(1);

    // Assert the sorted entries order
    expect(sortedEntries[0].id).toBe("1");
  });
  
  it("sorts no entry by returning nothing", () => {
    // Mock entries (none).
    const mockEntriesToRender: EntryType[] = [];
    
    // Render the list of entries w/ necessary Entries context.
    const { result } = renderHook(() => useEntriesSortedByDate(), {
      wrapper: ({ children }) => (
        <EntriesProvider initialEntries={mockEntriesToRender}>
          { children }
        </EntriesProvider>
      )
    });

    const sortedEntries: EntryType[] = result.current;

    // Make sure there are still three entries.
    expect(sortedEntries).toHaveLength(0);
  });
});