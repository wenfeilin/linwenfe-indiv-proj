// So Spotify is recognized as a type
///  <reference types="@types/spotify-web-playback-sdk"/>
import { useState, useEffect, useRef } from "react";
import type { Song } from "./SongSelection";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

function SpotifyPlayer({
  currentTrackToPlay,
  addingSong,
}: {
  currentTrackToPlay: Song | null;
  addingSong: boolean;
}) {
  const playerRef = useRef<Spotify.Player | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  // const [isActive, setIsActive] = useState(false);

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
          console.log("Ready with Device ID ", device_id);
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

            console.log("Playback has been transferred!");
          } catch (err) {
            console.log(err);
          }
        },
      );

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline ", device_id);
        },
      );

      player.addListener("player_state_changed", async (state) => {
        if (!state) {
          console.log("Player is not active");

          // return;
        } else {
          console.log("Player is active", state);
        }
      });

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

  async function playSelectedSong() {
    try {
      // Play the song specified by the URI when play is pressed.
      console.log("device id", deviceId);

      const play_song_req_body = {
        device_id: deviceId,
        uris: [currentTrackToPlay?.uri],
      };

      await fetch(`${apiUrl}/player/play`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(play_song_req_body),
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }
  }

  // should also load song when play is pressed if there is already a song selection for the entry.

  // When current track changes, make API call to start playback with this new song.
  useEffect(() => {
    if (playerRef.current) {
      playSelectedSong();
      setIsPlaying(true);
      playerRef.current.pause();
    }
  }, [currentTrackToPlay]);

  useEffect(() => {
    if (!addingSong) {
      playerRef.current!.disconnect();
      console.log("Player disconnected");
    }
  }, [addingSong])
  

  return (
    // MAKE SURE NOTHING IS PRESSABLE UNTIL THE PLAYER IS LOADED!!

    <>
      <div>
        <div>
          <h1>Player</h1>

          <div className="flex gap-2">
            {/* Album Cover */}
            <img
              src={currentTrackToPlay?.albumCoverUrl}
              alt={`Cover of the album ${currentTrackToPlay?.album}`}
              className="h-12"
            ></img>{" "}
            <div className="flex w-full justify-between">
              {/* Song Info */}
              <div className="flex flex-col text-sm">
                <p>{currentTrackToPlay?.title}</p>
                <p className="text-gray-500">{currentTrackToPlay?.artists}</p>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={async () => {
                  if (playerRef.current) {
                    playerRef.current.togglePlay();
                    setIsPlaying(!isPlaying);
                  }
                }}
              >
                {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
              </button>
            </div>
          </div>

          <div>Progress Bar</div>
          <div>
            {/* Get rid of the bangs later! */}

            {/* Previous Song Button
            <button
              onClick={() => {
                playerRef.current!.previousTrack();
              }}
            >
              <SkipBack fill="black" />
            </button> */}

            {/* Next Song Button
            <button
              onClick={() => {
                playerRef.current!.nextTrack();
              }}
            >
              <SkipForward fill="black" />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SpotifyPlayer;
