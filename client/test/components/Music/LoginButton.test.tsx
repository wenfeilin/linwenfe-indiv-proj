import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithRouterAndEntries } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import LoginButton from "../../../src/components/Music/LoginButton";

describe("LoginButton", () => {
  it(`shows "Log in to Spotify!"`, () => {
    renderWithRouterAndEntries(<LoginButton />);

    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(/Log in to Spotify!/i);
  });
});