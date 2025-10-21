// So Spotify is recognized as a type
///  <reference types="@types/spotify-web-playback-sdk"/>
import { useEffect, useRef, useState } from "react";

// Handles music player setup (connecting, disconnecting, listening to basic events)
function useSpotifyPlayer() {
  const playerRef = useRef<Spotify.Player | null>(null);

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Create a Spotify player once when the component mounts.
  useEffect(() => {
    // Load Spotify's SDK script. (Downloads the SDK code from Spotify's servers and makes it
    // available as `window.Spotify`)
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // `.onSpotifyWebPlaybackSDKReady` is a global hook defined by the SDK. It is automatically
    // when the SDK script finishes loading.
    window.onSpotifyWebPlaybackSDKReady = async () => {
      // Create a new Spotify device.
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        // This callback provides the access token to Spotify.
        getOAuthToken: async (cb: any) => {
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          let token = null;

          try {
            // Get the (valid) access token.
            const response = await fetch(`${backendUrl}/auth/token`, {
              credentials: "include",
            }); // to send cookies w/ the request
            const data = await response.json();

            token = data.access_token;
          } catch (err) {
            console.log(err);
          }

          cb(token);
        },
        volume: 0.5,
      });

      // Save the player.
      playerRef.current = player;

      // Add event listeners to signal state of the player.

      player.addListener(
        "ready",
        async ({ device_id }: { device_id: string }) => {
          // console.log("Ready with Device ID ", device_id);
          setDeviceId(device_id);

          // Transfer playback to this player so it's ready to play music.
          try {
            const transfer_playback_req_body = {
              device_ids: [device_id],
            };

            await fetch(`${apiUrl}/player/device`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transfer_playback_req_body),
              credentials: "include", // so access token can be retrieved from cookies
            });

            // The Spotify player is ready to play some music!
            setIsReady(true)

            // console.log("Playback has been transferred!");
          } catch (err) {
            console.log(err);
          }
        },
      );

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          // console.log("Device ID has gone offline ", device_id);
        },
      );

      // player.addListener("player_state_changed", (state) => {
        
      // });

      // Error event listeners
      player.addListener(
        "initialization_error",
        ({ message }: { message: string }) => {
          console.log(message);
        },
      );

      player.addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          console.log(message);
        },
      );

      player.addListener(
        "account_error",
        ({ message }: { message: string }) => {
          console.log(message);
        },
      );

      player.addListener(
        "playback_error",
        ({ message }: { message: string }) => {
          console.log(message);
        },
      );

      // Connect the player.
      player.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!",
          );
        }
      });
    };
  }, []);

  return {
    playerRef,
    deviceId, 
    isReady,
  };
}

export default useSpotifyPlayer;
