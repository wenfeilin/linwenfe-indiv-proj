import React from "react";
import { renderWithRouterAndEntries } from "../test-utils"
import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Calendar from "../../src/components/Calendar/Calendar";
import { useParams } from "react-router";
import "@testing-library/jest-dom/vitest";

describe("Calendar", () => {
  // January 2025 Calendar
  const renderOptions = {
    route: "/my-calendar/2025/1",
  };

  // Mock the child components.
  vi.mock("../../src/components/Calendar/CalendarHeader", () => ({
    default: () => (<div data-testid="calendar-header">Mocked Calendar Header</div>)
  }));
  
  vi.mock("../../src/components/Calendar/CalendarBlock", () => ({
    default: ({ blockDate }: { blockDate: Date }) => (<div data-testid="calendar-block">{`${blockDate.getFullYear()}-${blockDate.getMonth() + 1}-${blockDate.getDate()}`}</div>)
  }));
  
  vi.mock("react-loader-spinner", () => ({
    RotatingLines: () => (
      <div data-testid="loading-spinner"> Loading...</div>
    )
  }));

  // Create a mock of useParams function (but keep everything else in react-router the same).
  vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");
    
    return {
      ...actual,
      useParams: vi.fn().mockReturnValue({
        // Set valid default mock values.
        year: "2025",
        month: "1",
      })
    };
  });

  // Mock the setIsCalendarLoading function so it's callable in Calendar component.
  const mockSetIsCalendarLoading = vi.fn();

  beforeEach(() => {
    // Clear information about mock function.
    mockSetIsCalendarLoading.mockClear();
  })

  it("renders all child components", () => {
    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading}/>, renderOptions);

    // Get all child components.
    const header = screen.getByTestId("calendar-header");
    const dayLabels = screen.getAllByText(/Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/);
    const blocks = screen.getAllByTestId("calendar-block");

    // Assert that the header, day labels, and 42 blocks are rendered.
    expect(header).toBeInTheDocument();
    expect(dayLabels).toHaveLength(7); // 7 days a week
    expect(blocks).toHaveLength(42); // 6 weeks x 7 days
  });

  it("renders correct day labels in order", () => {
    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);
    
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayLabels = screen.getAllByText(/Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/);

    // Assert that each label matches the order in the days array.
    dayLabels.forEach((label, index) => expect(label).toHaveTextContent(days[index]));
  });

  it("renders components in correct order", () => {
    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    const calendar = screen.getByTestId("calendar");
    const children = calendar.children;

    // Assert the order of the child components.
    expect(children).toHaveLength(1 + 7 + 42); // header + day labels + calendar blocks
    expect(children[0]).toHaveAttribute("data-testid", "calendar-header");
    expect(children[1]).toHaveTextContent("Sunday");
    expect(children[8]).toHaveAttribute("data-testid", "calendar-block");
  });

  it("shows a loading spinner when calendar is first rendered", () => {
    // Mock return values of useParams to mirror what the URL params are on the first render.
    vi.mocked(useParams).mockReturnValue({
      year: undefined,
      month: undefined,
    });

    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    const loadingSpinner = screen.getByTestId("loading-spinner");

    // Assert that the calendar is loading on first render.
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("shows the calendar once params are available", async () => {
    // Mock return values of useParams to mirror what the URL params are on renders after the first one.
    vi.mocked(useParams).mockReturnValue({
      year: "2025",
      month: "1",
    });

    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    // Wait for calendar to render once params are available.
    const calendar = await screen.findByTestId("calendar");

    // Assert that the calendar appears on the second render.
    expect(calendar).toBeInTheDocument();
  });

  it("renders correct dates for calendar blocks", () => {
    // Mock return values of useParams to mirror what the URL params are on renders after the first one.
    vi.mocked(useParams).mockReturnValue({
      year: "2025",
      month: "1",
    });

    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    const blocks = screen.getAllByTestId("calendar-block");

    // Assert that the first block is for December 29, 2024.
    expect(blocks[0]).toHaveTextContent("2024-12-29");
    // Assert that the first day of January is the 4th block.
    expect(blocks[3]).toHaveTextContent("2025-1-1");

    // Assert that a block around the middle of the month is for January 12, 2025.
    expect(blocks[15]).toHaveTextContent("2025-1-13");

    // Assert that the last block is for February 8, 2025.
    expect(blocks[41]).toHaveTextContent("2025-2-8")
  });

  it("doesn't set loading state to false when URL params are valid", () => {
    // Mock return values of useParams to mirror what the URL params are on renders after the first one.
    vi.mocked(useParams).mockReturnValue({
      year: "2025",
      month: "1",
    });

    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    // Assert that the calendar is loading.
    expect(mockSetIsCalendarLoading).not.toHaveBeenCalled();
  });

  it("sets loading state to false when URL params are undefined", () => {
    // Mock return values of useParams to mirror what the URL params are on the first render.
    vi.mocked(useParams).mockReturnValue({
      year: undefined,
      month: undefined,
    });

    renderWithRouterAndEntries(<Calendar setIsCalendarLoading={mockSetIsCalendarLoading} />, renderOptions);

    // Assert that the calendar is loading.
    expect(mockSetIsCalendarLoading).toHaveBeenCalledWith(false);
  });
});