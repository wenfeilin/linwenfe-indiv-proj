import React from "react";
import { getByRole, getByTestId, queryAllByRole, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterAndEntries } from "../../test-utils"
import "@testing-library/jest-dom/vitest";
import ExportPlaylistComponent, { ExportMsgType } from "../../../src/components/Music/ExportPlaylistComponent";

describe("ExportPlaylistComponent", () => {
  // Mock the child component.
  vi.mock("../../../src/components/Music/ExportPlaylistButton", () => ({
    default: ({ 
      setPlaylistUrl, 
      setShowExportPlaylistMsg, 
      setExportPlaylistMsg 
    }: { 
      setPlaylistUrl: (url: string) => void, 
      setShowExportPlaylistMsg: (show: boolean) => void, 
      setExportPlaylistMsg: (msg: ExportMsgType) => void 
    }) => (
      <button
        onClick={() => {
          // Simulate export result.
          setPlaylistUrl("link to spotify playlist");
          setShowExportPlaylistMsg(true);
          setExportPlaylistMsg({
            before: "Your",
            linkText: "playlist",
            after: "!"
          });
        }}>
        Mocked Export Btn
      </button>)
  }));

  vi.mock("react-datepicker", () => ({
    default: () => (<div data-testid="date-picker">Mocked Date Picker</div>)
  }));

  // Mock the set state function so it's callable.
  const mockSetIsLoggedIn = vi.fn(); // Note: not currently being used in component but is a passed in prop, so I'm mocking it still.
  const mockCheckLoginStatus = vi.fn(); // Note: checkLoginStatus is a function but since is not being used in the component rn. I'm stilling mocking it here for future use.

  beforeEach(() => {
    // Clear information about mock function.
    mockSetIsLoggedIn.mockClear(); 
    mockCheckLoginStatus.mockClear(); 
  });

  describe("when logged in", () => {
    const loginStatus = true;

    it("shows Export Playlist when not clicked on", () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={mockCheckLoginStatus} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      // Click the Export button.
      const button = screen.getByRole("button");
      
      // Assert that there are indeed no songs to export.
      expect(button).toHaveTextContent(/Export Playlist/i);
      expect(mockCheckLoginStatus).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("shows date picker and Export and Cancel btns when clicked on", async () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={() => true} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      // Click the Export button.
      const button = screen.getByRole("button");
      await userEvent.click(button);

      const datePicker = screen.getByTestId("date-picker");
      const btns = screen.queryAllByRole("button");
      
      // Assert that the date picker and Export and Cancel btns appear.
      expect(datePicker).toBeInTheDocument();
      expect(btns).toHaveLength(2);
      expect(btns[0]).toHaveTextContent("Export");
      expect(btns[1]).toHaveTextContent("Cancel");
    });

    it("resulting export message appears after clicking on Export button (playlist with link)", async () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={() => true} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      // Click the Export button.
      const button = screen.getByRole("button");
      await userEvent.click(button);

      const exportBtn = screen.getByText(/Export/i);
      await userEvent.click(exportBtn);

      const msg = await screen.findByText(/your/i);
      const link = await screen.findByText(/playlist/i);
      
      // Assert that an export message and link appear.
      expect(msg).toBeInTheDocument();
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
    });

    // it("resulting export message appears after clicking on Export button (no playlist)", async () => {
    //   // Override the mock for this specific test
    //   const NoSongsMockButton = ({ 
    //     setPlaylistUrl, 
    //     setShowExportPlaylistMsg, 
    //     setExportPlaylistMsg 
    //   }: any) => (
    //     <button
    //       onClick={() => {
    //         setPlaylistUrl("N/A");
    //         setShowExportPlaylistMsg(true);
    //         setExportPlaylistMsg({
    //           before: "No songs to export..."
    //         });
    //       }}>
    //       Mocked Export Btn
    //     </button>
    //   );

    //   // Re-mock only for this test.
    //   vi.doMock("../../../src/components/Music/ExportPlaylistButton", () => ({
    //     default: NoSongsMockButton
    //   }));

    //   // Render the export component.
    //   render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={() => true} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
    //   // Click the Export button.
    //   const button = screen.getByRole("button");
    //   await userEvent.click(button);

    //   const exportBtn = screen.getByText(/Export/i);
    //   await userEvent.click(exportBtn);

    //   // Assert that an export message appears after the set Export and Cancel buttons.
    //   const msg = await screen.findByText(/no songs/i);
    //   const link = screen.queryByRole("link");
      
    //   // Assert that an export message and link appear.
    //   expect(msg).toBeInTheDocument();
    //   expect(link).toBe(null);
    // });
  });

  describe("when not logged in", () => {
    const loginStatus = false;

    it("shows Export Playlist when not clicked on", () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={mockCheckLoginStatus} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      const button = screen.getByRole("button");
      
      // Assert that there are indeed no songs to export.
      expect(button).toHaveTextContent(/Export Playlist/i);
      expect(mockCheckLoginStatus).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("tells user to login when clicked on and shows Cancel button", async () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={() => true} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      // Click the Export button.
      const button = screen.getByRole("button");
      await userEvent.click(button);

      const msg = screen.getByText("Log in to Spotify to use music features");
      const newBtn = screen.getByRole("button");
      
      // Assert that there are indeed no songs to export.
      expect(msg).toBeInTheDocument();
      expect(newBtn).toHaveTextContent("Cancel");
    });

    it(`clicking Cancel after clicking on the button shows "Export Playlist"`, async () => {
      // Render the export component.
      render(<ExportPlaylistComponent containerStyles="" checkLoginStatus={() => true} setIsLoggedIn={mockSetIsLoggedIn} isLoggedIn={loginStatus} />);
  
      // Click the Export button.
      const exportBtn = screen.getByRole("button");
      await userEvent.click(exportBtn);

      // Click the Cancel button.
      const cancelBtn = screen.getByRole("button");
      await userEvent.click(cancelBtn);

      // Assert that it only shows Export again.
      const btns = screen.queryAllByRole("button");
      expect(btns).toHaveLength(1);
      expect(btns[0]).toHaveTextContent("Export Playlist");

      const msg = screen.queryByText("Log in to Spotify to use music features");
      expect(msg).toBe(null);
    });
  });
});