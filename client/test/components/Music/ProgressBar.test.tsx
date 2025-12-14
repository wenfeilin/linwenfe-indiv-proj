import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithMusicPlayer } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import ProgressBar from "../../../src/components/Music/ProgressBar";

describe("ProgressBar", () => {
  it("shows start and end timestamp and progress bar in between", () => {
    const progress = 0; 
    const songDur = 120000; // 2 minutes
    const playerType = "entry";
    const isDisabled = false;

    renderWithMusicPlayer(<ProgressBar progress={progress} songDuration={songDur} playerType={playerType} isDisabled={isDisabled} />);

    const children = screen.getByTestId("progress-bar-container").children;

    // Assert existence of timestamps and progress bar and correct order (progress bar between time stamps).
    expect(children[0]).toHaveTextContent("0:00");
    expect(children[1]).toHaveRole("slider");
    expect(children[2]).toHaveTextContent("2:00");
  });

  it("shows correct timestamp for no song (song w/o duration)", () => {
    const progress = 0;
    const songDur = 0;
    const playerType = "entry";
    const isDisabled = false;

    renderWithMusicPlayer(<ProgressBar progress={progress} songDuration={songDur} playerType={playerType} isDisabled={isDisabled} />);

    const startTimeStamp = screen.getByText("0:00");
    const endTimeStamp = screen.getByText("--:--");

    // Assert correct time stamps for when there is no song to play.
    expect(startTimeStamp).toBeInTheDocument();
    expect(endTimeStamp).toBeInTheDocument();
  });

  it("shows correct timestamp for song (w/ duration)", () => {
    const progress = 60000; // 1 minute
    const songDur = 120000; // 2 minutes
    const playerType = "entry";
    const isDisabled = false;

    renderWithMusicPlayer(<ProgressBar progress={progress} songDuration={songDur} playerType={playerType} isDisabled={isDisabled} />);

    const startTimeStamp = screen.getByText("1:00");
    const endTimeStamp = screen.getByText("2:00");

    // Assert correct time stamps for when there is no song to play.
    expect(startTimeStamp).toBeInTheDocument();
    expect(endTimeStamp).toBeInTheDocument();
  });

  // Requires more mocking, so skipping this one.
  // it("current progress time stamp changes when slider is dragged", async () => {
  //   const progress = 60000; // 1 minute
  //   const songDur = 120000; // 2 minutes
  //   const playerType = "entry";
  //   const isDisabled = false;

  //   renderWithMusicPlayer(<ProgressBar progress={progress} songDuration={songDur} playerType={playerType} isDisabled={isDisabled} />);

  //   const slider = screen.getByRole("slider");
  //   const currProgress = screen.getByText("1:00");
  //   const totalDur = screen.getByText("2:00");

  //   // Assert state of progress bar before slider is dragged.
  //   expect(currProgress).toBeInTheDocument();
  //   expect(totalDur).toBeInTheDocument();

  //   // Drag slider to 1:05.
  //   fireEvent.change(slider, { target: { value: 65000 } });

  //   // Assert change in current progress.
  //   const newProgress = await screen.findByText("1:05");
  //   expect(newProgress).toBeInTheDocument();
  //   expect(totalDur).toBeInTheDocument();
  // });
});