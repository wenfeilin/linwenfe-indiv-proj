import React from "react";
import { renderWithRouterAndEntries } from "../../test-utils"
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import CalendarBlock from "../../../src/components/Calendar/CalendarBlock";
import "@testing-library/jest-dom/vitest";

describe("CalendarBlock", () => {
  it("shows correct day", () => {
    const date = new Date(2025, 2, 9); // March 9, 2025 

    // Render a calendar block for the date March 9, 2025.
    renderWithRouterAndEntries(<CalendarBlock blockDate={date}/>, { route: "/my-calendar/2025/3" });

    // Assert that the number on the block is 9.
    const dayNumber = screen.getByTestId("day-number");
    expect(dayNumber).toHaveTextContent("9");
  });

  it("has white background for date in current month", () => {
    const dateInMonth = new Date(2024, 1, 29); // February 29, 2024 

    // Render a calendar block for a date in February for the February calendar.
    renderWithRouterAndEntries(<CalendarBlock blockDate={dateInMonth}/>, { route: "/my-calendar/2025/2" });

    // Assert that the calendar block in the month is white.
    const calendarBlock = screen.getByTestId("calendar-block");
    expect(calendarBlock).toHaveClass("bg-white");
  });

  it("has gray background for date outside current month", () => {
    const dateOutsideMonth = new Date(2024, 2, 1); // March 1, 2024

    // Render a calendar block for a date in March for the February calendar.
    renderWithRouterAndEntries(<CalendarBlock blockDate={dateOutsideMonth}/>, { route: "/my-calendar/2025/2" });

    // Assert that the calendar block outside the month is gray.
    const calendarBlock = screen.getByTestId("calendar-block");
    expect(calendarBlock).toHaveClass("bg-gray-500");
  });

  it("highlights today's day", () => {
    // Get today's date.
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Render a calendar block for today's date.
    renderWithRouterAndEntries(<CalendarBlock blockDate={today} />, { route: `/my-calendar/${year}/${month}` });

    // Assert that the calendar block for today has a yellow background.
    const calendarBlock = screen.getByTestId("calendar-block");
    expect(calendarBlock).toHaveClass("bg-yellow-300");
  });

  // Constants for tests that check entry state.
  const date = new Date(2025, 4, 20); // May 20, 2025 
  const dateOutsideMonth = new Date(2025, 5, 1); // June 1, 2025
  const mockEntry = {
    id: "1",
    date: "2025-5-20",
    content: "My first entry.",
    songSelection: null,
    songNotes: "",
  }

  const route = "/my-calendar/2025/5"
  const filledEntryRenderOptions = {
    route: route,
    initialEntries: [ mockEntry ],
  }
  const emptyEntryRenderOptions = {
    route: route,
    initialEntries: [],
  }

  // Helper function
  const renderBlock = (date: Date, options = filledEntryRenderOptions) => {
    return renderWithRouterAndEntries(<CalendarBlock blockDate={date}/>, options);
  }

  it("indicates the day's entry is filled for non-empty entry", () => {
    // Render a calendar block which has its associated entry filled.
    renderBlock(date, filledEntryRenderOptions);

    // Assert that the calendar block renders an element for an entry existing but no song selection in it.
    const entryIndicator = screen.getByTestId("entry-indicator");
    const songIndicator = screen.queryByTestId("song-indicator");
    expect(entryIndicator).toBeInTheDocument();
    expect(songIndicator).toHaveClass("invisible");
  });

  it("doesn't indicate day's entry is filled for empty entry", () => {
    // Render a calendar block which has its associated entry unfilled.
    renderBlock(date, emptyEntryRenderOptions);

    // Assert that the calendar block doesn't render an indicators for an empty entry.
    const entryIndicator = screen.queryByTestId("entry-indicator");
    const songIndicator = screen.queryByTestId("song-indicator");
    expect(entryIndicator).toHaveClass("invisible");
    expect(songIndicator).toHaveClass("invisible");
  });

  it("indicates there is a song selection for an entry with one", () => {
    // Render a calendar block which has its associated entry filled.
    renderBlock(date, filledEntryRenderOptions);

    // Assert that the calendar block renders both elements for an entry existing and a song selection existing.
    const entryIndicator = screen.getByTestId("entry-indicator");
    const songIndicator = screen.getByTestId("song-indicator");
    expect(entryIndicator).toBeInTheDocument();
    expect(songIndicator).toBeInTheDocument();
  });

  it("navigates to entry if date is in the month", async () => {
    // Render a calendar block that is in the calendar month being rendered.
    renderBlock(date, emptyEntryRenderOptions);

    // Assert that the URL path before clicking on the calendar block is for the calendar page.
    let urlPath = screen.getByText(route);
    expect(urlPath).toBeInTheDocument();

    const calendarBlock = screen.getByTestId("calendar-block");

    // Mock clicking the calendar block.
    await userEvent.click(calendarBlock);

    // Assert that the URL path after clicking on the calendar block is for the entry page.
    urlPath = screen.getByText("/entry/2025/5/20");
    expect(urlPath).toBeInTheDocument();
  });

  it("doesn't navigate to entry if date isn't in the month", async () => {
    // Render a calendar block that is outside of the calendar month being rendered.
    renderBlock(dateOutsideMonth, emptyEntryRenderOptions);

    // Assert that the URL path before clicking on the calendar block is for the calendar page.
    let urlPath = screen.getByText(route);
    expect(urlPath).toBeInTheDocument();

    const calendarBlock = screen.getByTestId("calendar-block");

    // Mock clicking the calendar block.
    await userEvent.click(calendarBlock);

    // Assert that the URL path after clicking on the calendar block is still for the calendar page.
    urlPath = screen.getByText(route);
    expect(urlPath).toBeInTheDocument();
  });
});