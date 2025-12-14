import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import VolumeBar from "../../../src/components/Music/VolumeBar";

describe("VolumeBar", () => {
  const initialVolume = 1;
  const isDisabled = false;

  it("shows volume icons and volume bar", () => {
    renderWithMusicPlayer(<VolumeBar volume={initialVolume} isDisabled={isDisabled} />);

    const children = screen.getByTestId("volume-bar-container").children;

    expect(children[0]).toHaveClass(/volume/i);
    expect(children[1]).toHaveRole("slider");
  });

  it("renders low volume icon", () => {
    renderWithMusicPlayer(<VolumeBar volume={0.24} isDisabled={true} />);

    const lowVolIcon = screen.getByTestId("low-vol-icon");

    expect(lowVolIcon).toBeInTheDocument();
  });

  it("renders medium volume icon", () => {
    renderWithMusicPlayer(<VolumeBar volume={0.74} isDisabled={true} />);

    const medVolIcon = screen.getByTestId("med-vol-icon");

    expect(medVolIcon).toBeInTheDocument();
  });

  it("renders high volume icon", () => {
    renderWithMusicPlayer(<VolumeBar volume={1} isDisabled={true} />);

    const highVolIcon = screen.getByTestId("high-vol-icon");

    expect(highVolIcon).toBeInTheDocument();
  });

  it("renders muted volume icon", () => {
    renderWithMusicPlayer(<VolumeBar volume={0} isDisabled={true} />);

    const mutedIcon = screen.getByTestId("muted-vol-icon");

    expect(mutedIcon).toBeInTheDocument();
  });

  it("can be disabled", () => {
    renderWithMusicPlayer(<VolumeBar volume={initialVolume} isDisabled={true} />);

    const volumeBar = screen.getByRole("slider");

    expect(volumeBar).toBeDisabled();
  });
});