import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../test-utils"
import "@testing-library/jest-dom/vitest";
import PageHeader from "../../src/components/PageHeader";

describe("PageHeader", () => {
  it("shows the logo and links", () => {
    const now = new Date();
    const currMonth = now.getMonth() + 1;
    const currYear = now.getFullYear();

    renderWithRouterAndEntries(<PageHeader />);

    const logo = screen.getByAltText(/music journal icon created by Wenfei Lin/i);
    const links = screen.queryAllByRole("link");
    
    // Assert existence of logo link and what page it links to.
    expect(logo).toBeInTheDocument();
    expect(links[0]).toHaveAttribute("href", `/my-calendar/${currYear}/${currMonth}`);

    // Assert existence of other links and what page they link to.
    expect(links[1]).toHaveTextContent(/My Calendar/i);
    expect(links[1]).toHaveAttribute("href", `/my-calendar/${currYear}/${currMonth}`);

    expect(links[2]).toHaveTextContent(/My Entries/i);
    expect(links[2]).toHaveAttribute("href", `/my-entries`);
  });

  it("clicking on the logo navigates to the calendar page", async () => {
    const now = new Date();
    const currMonth = now.getMonth() + 1;
    const currYear = now.getFullYear();

    renderWithRouterAndEntries(<PageHeader />);

    // Get the logo (link).
    const links = screen.queryAllByRole("link");
    await userEvent.click(links[0]);

    let path = screen.getByTestId("location-display");
    
    // Assert the path after navigating is for the calendar page (of today).
    expect(path).toHaveTextContent(`/my-calendar/${currYear}/${currMonth}`);
  });

  it("clicking on My Calendar navigates to the calendar of the current month and year", async () => {
    const now = new Date();
    const currMonth = now.getMonth() + 1;
    const currYear = now.getFullYear();

    renderWithRouterAndEntries(<PageHeader />);

    // Get calendar link.
    const link = screen.getByText(/calendar/i);
    await userEvent.click(link);

    let path = screen.getByTestId("location-display");
    
    // Assert the path after navigating is for the calendar page (of today).
    expect(path).toHaveTextContent(`/my-calendar/${currYear}/${currMonth}`);
  });

  it("clicking on My Entries navigates to the right page", async () => {
    renderWithRouterAndEntries(<PageHeader />);

    // Get entries link.
    const link = screen.getByText(/entries/i);
    await userEvent.click(link);

    let path = screen.getByTestId("location-display");
    
    // Assert the path after navigating is for the entries page.
    expect(path).toHaveTextContent(`/my-entries`);
  });

  it("clicking on Spotify Login navigates to the right page", async () => {
    renderWithRouterAndEntries(<PageHeader />);

    // Get Spotify login link.
    const link = screen.getByText(/login/i);
    await userEvent.click(link);

    let path = screen.getByTestId("location-display");
    
    // Assert the path after navigating is for the Spotify login page.
    expect(path).toHaveTextContent(`/spotify-login`);
  });
});