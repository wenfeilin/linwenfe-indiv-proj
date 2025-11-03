import { useEffect } from "react";
import LoginButton from "../components/Music/LoginButton";

function SpotifyLoginPage({checkLoginStatus, isLoggedIn, setIsLoggedIn}: {checkLoginStatus: any, isLoggedIn: boolean, setIsLoggedIn: (isLoggedIn: boolean) => void}) {
  // Check login status on every re-render.
  // useEffect(() => {
  //   checkLoginStatus(setIsLoggedIn);
  // });

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);

  //   // Check if access was denied by user on mount (this page gets mounted/redirected to if the login btn was pressed)
  //   if (params.get("auth_denied")) {
  //     // Update login status
  //     setIsLoggedIn(false);
  //     console.log("user denied access");
  //     console.log(isLoggedIn);

  //     // Reset the URL
  //     window.history.replaceState({}, "", window.location.pathname);
  //   }
  // }, []);

  return(
    <div className="flex flex-col items-center h-full pt-4">
      <p className="w-4/5 mb-10 bg-blue-200 p-2 px-3 rounded"><span className="font-bold">Log in for the following music features:</span> adding a song selection to your entry, exporting a playlist of the songs from a month's entries, and directly playing the songs from a month's entries.</p>
      <LoginButton isLoggedIn={isLoggedIn} checkLoginStatus={checkLoginStatus} />
    </div>
  );
}

export default SpotifyLoginPage;