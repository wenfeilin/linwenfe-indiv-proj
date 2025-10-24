import React from "react";
import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../test-utils";
import EntriesList from "../../src/components/Entry/EntriesList";
import { EntryType } from "../../src/contexts/EntriesContext";
import { type Location } from "react-router";
import "@testing-library/jest-dom/vitest";
import { getDateParts } from "../../src/utils/date";

describe("EntriesList", () => {
  const renderOptions = {
    route: "/my-entries/",
  };

  const mockEntriesToRender: { entryNum: number, entry: EntryType }[] = [
    {
      entryNum: 1,
      entry: {
        id: "1",
        date: "2025-10-1",
        content: "It's October!",
        songSelection: null,
        songNotes: "",
      }
    },
    {
      entryNum: 2,
      entry: {
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
      }
    },
    {
      entryNum: 3,
      entry: {
        id: "3",
        date: "2025-10-4",
        content: "I didn't write an entry yesterday...",
        songSelection: null,
        songNotes: "",
        }
    }
  ];

  const mockLocation: Location = {
    pathname: "/my-entries",
    search: "",
    hash: "",
    state: null,
    key: "default",
  };

  it("renders all specified entries", () => {
    // Render the list of entries.
    renderWithRouterAndEntries(<EntriesList entriesToRender={mockEntriesToRender} location={mockLocation} />, renderOptions);

    // Assert that the number of entries rendered is the same as how many are in mockEntriesToRender.
    const numEntries = mockEntriesToRender.length;
    const listedEntries = screen.getAllByTestId("listed-entry");
    expect(listedEntries).toHaveLength(numEntries);
  });

  it("renders the correct date, entry number, and link to the entry for each entry", () => {
    // Render the list of entries.
    renderWithRouterAndEntries(<EntriesList entriesToRender={mockEntriesToRender} location={mockLocation} />, renderOptions);
    
    // Get all listed entries.
    const listedEntries = screen.getAllByTestId("listed-entry");

    mockEntriesToRender.forEach((mockEntry, index) => {
      const renderedEntry = listedEntries[index];
      const entryDate = mockEntry.entry.date;
      const entryNum = mockEntry.entryNum;
      const link = within(renderedEntry).getByRole("link");
      const [ year, month, day ] = getDateParts(entryDate);

      // Assert that the date, entry number, and link to entry are rendered.
      expect(entryDate).toBeInTheDocument();
      expect(`Entry #${entryNum}`).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/entry/${year}/${month}/${day}`);
    })
  });
});