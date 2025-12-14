import React from "react";
import { renderWithRouterAndEntries } from "../../test-utils"
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import CalendarHeader from "../../../src/components/Calendar/CalendarHeader";
import "@testing-library/jest-dom/vitest";

describe("CalendarHeader", () => {
  // January 2025 Calendar
  const JanuaryRenderOptions = {
    route: "/my-calendar/2025/1",
  };

  it("shows correct month and year", () => {
    // Render a calendar header for January 2025.
    renderWithRouterAndEntries(<CalendarHeader />, JanuaryRenderOptions);

    // Assert that the right month name and year are rendered.
    const monthAndYear = screen.getByRole("heading");
    expect(monthAndYear).toHaveTextContent("January 2025");
  });

  it("renders correct calendar navigation arrows and links for the first month of the year", () => {
    // Render a calendar header for January 2025.
    renderWithRouterAndEntries(<CalendarHeader />, JanuaryRenderOptions);

    const prevMonthLink = screen.getByTestId("prev-month-link");
    const nextMonthLink = screen.getByTestId("next-month-link");

    // Assert that the navigation symbols render.
    expect(prevMonthLink).toBeInTheDocument();
    expect(nextMonthLink).toBeInTheDocument();

    // Assert that the correct navigation links are calculated.
    expect(prevMonthLink).toHaveAttribute("href", "/my-calendar/2024/12");
    expect(nextMonthLink).toHaveAttribute("href", "/my-calendar/2025/2");
  });

  const DecemberRenderOptions = {
    route: "/my-calendar/2025/12",
  };

  it("renders correct calendar navigation arrows and links for the last month of the year", () => {
    // Render a calendar header for December 2025.
    renderWithRouterAndEntries(<CalendarHeader />, DecemberRenderOptions);

    const prevMonthLink = screen.getByTestId("prev-month-link");
    const nextMonthLink = screen.getByTestId("next-month-link");

    // Assert that the navigation symbols render.
    expect(prevMonthLink).toBeInTheDocument();
    expect(nextMonthLink).toBeInTheDocument();

    // Assert that the correct navigation links are calculated.
    expect(prevMonthLink).toHaveAttribute("href", "/my-calendar/2025/11");
    expect(nextMonthLink).toHaveAttribute("href", "/my-calendar/2026/1");
  });

  it("navigates to previous and next months correctly", async () => {
    // Render a calendar header for December 2025.
    renderWithRouterAndEntries(<CalendarHeader />, DecemberRenderOptions);
    
    const prevMonthLink = screen.getByTestId("prev-month-link");
    const nextMonthLink = screen.getByTestId("next-month-link");
    
    // Mock clicking ◄ to navigate to the previous month.
    await userEvent.click(prevMonthLink);
    
    // Assert that the URL path is now for November 2025.
    let urlPath = screen.getByText("/my-calendar/2025/11");
    expect(urlPath).toBeInTheDocument();


    // Mock clicking ► twice to navigate to the next month from December.
    await userEvent.click(nextMonthLink);
    await userEvent.click(nextMonthLink);
    
    // Assert that the URL path is now for January 2026.
    urlPath = screen.getByText("/my-calendar/2026/1");
    expect(urlPath).toBeInTheDocument();
  });
});