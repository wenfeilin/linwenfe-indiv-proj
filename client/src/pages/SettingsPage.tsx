import { useState } from "react";
import LoginButton from "../components/Music/LoginButton";

function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function checkLoginStatus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        { credentials: "include" },
      ); // to send cookies w/ the request
      const body = await response.json();

      // console.log("Fetch was called.");

      setIsLoggedIn(body.loggedIn);
      
      // console.log("Login status was set as: ", body.loggedIn);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <LoginButton
        isLoggedIn={isLoggedIn}
        checkLoginStatus={checkLoginStatus}
      ></LoginButton>
      {console.log("Login status: ", isLoggedIn)}
      {isLoggedIn && <p>You are already logged in!</p>}
      {/* <SongSearchForm></SongSearchForm>
      <SpotifyPlayer></SpotifyPlayer> */}
    </>
  );
}

export default SettingsPage;
