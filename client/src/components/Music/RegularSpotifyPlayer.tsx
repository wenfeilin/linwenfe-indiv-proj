import type { Song } from "./SongSelection";
import { Pause, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { ColorRing } from "react-loader-spinner";
import VolumeBar from "./VolumeBar";
import { useEffect, useState } from "react";

function RegularSpotifyPlayer({
  songSelection,
  isEditing,
  isAddSongBtnActive,
  setIsSearching,
  setSongToPlay,
}: {
  songSelection: Song | null;
  isEditing: boolean;
  isAddSongBtnActive: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setSongToPlay: (song: Song | null) => void;
}) {
  const musicPlayer = useMusicPlayer();

  useEffect(() => {
    // Set track to play to queue it up when play is pressed
    if (musicPlayer) {
      musicPlayer?.setTrackToPlay(songSelection);
    }
  }, [songSelection])

  // console.log("Currently going to play", musicPlayer?.currentTrack?.title, "by", musicPlayer?.currentTrack?.artists);

  // console.log("is playing?", musicPlayer?.isPlaying)

  // IDK if this is the best place to check this; maybe it should be higher up  (in the component tree, like when the musicPlayer is loaded) idk
  // Check the pointer type (coarse = touch input)
  const onMobileDevice = window.matchMedia("(pointer: coarse").matches;

  // console.log(musicPlayer?.progress);

  return (
    <div className="mb-1 flex flex-col gap-6 rounded-lg border-2 p-2 pb-4">
      <div className="flex gap-2">
        {/* Album Cover */}
        {
          // FIX THIS EMPTY DIV SIZING WHEN THERE IS NO SONG SELECTED/PRESSED FOR PLAYING

          <div
            className={`w-1/3 rounded border-2 ${!songSelection && "bg-gray-100"}`}
          >
            {songSelection && (
              <img
                src={songSelection?.albumCoverUrls[2]}
                alt={`Cover of the album ${songSelection?.album}`}
                className="rounded border-2 border-transparent"
              ></img>
            )}
          </div>
        }

        {/* Song Info */}
        <div className="flex flex-col gap-1 pt-1 text-sm">
          <p>{songSelection?.title}</p>
          <p className="text-gray-500">{songSelection?.artists}</p>
        </div>
      </div>

      <div className="flex justify-center">
        {(musicPlayer?.isReady && !(musicPlayer?.isLoadingSong)) ?
          // Play/Pause Button
          (<button
            className="p-1 hover:cursor-pointer hover:opacity-80"
            disabled={!(musicPlayer?.isReady)}
            onClick={async () => {
              // Switch to entry player context (and pause the calendar player).
              musicPlayer.updatePlayerState("entry");
              // if (musicPlayer.playerModeRef.current === "calendar") {
              //   musicPlayer.previouslyPlayedModeRef.current = "calendar";
              // } else {
              //   musicPlayer.previouslyPlayedModeRef.current = "entry";
              // }

              // console.log("mode before play", musicPlayer.previouslyPlayedModeRef.current);
              // console.log("curr mode", musicPlayer.playerModeRef.current);

              
              // musicPlayer.playerModeRef.current = "entry";
              // console.log("curr mode", musicPlayer.playerModeRef.current);

              // musicPlayer.setIsPlayingGlobal(false);
              // musicPlayer.resetProgress("calendar");
            
              await musicPlayer.togglePlay();
            }}
          >
            {musicPlayer!.isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
          </button>) :
          (<ColorRing colors={["#25c21d", "#25c21d", "#25c21d", "#25c21d", "#25c21d"]} height={42} />)
        }
      </div>

      <ProgressBar
        progress={musicPlayer!.progress}
        songDuration={songSelection ? songSelection.durationMS : 1}
        playerType="entry"
        isDisabled={musicPlayer?.playerModeRef.current === "calendar" || musicPlayer?.playerModeRef.current === null}
      ></ProgressBar>
      
      {/* Volume Bar */}
      {/* According to Spotify Web Playback SDK, mobile devices must control the volume through hardware, so don't render the volume bar! */}
      {!onMobileDevice && 
        <VolumeBar
          volume={musicPlayer!.volume}
          isDisabled={musicPlayer?.playerModeRef.current === "calendar" || musicPlayer?.playerModeRef.current === null}
        ></VolumeBar>
      }

      {(isAddSongBtnActive && isEditing) && <div className="flex justify-center">
        <button
          className="rounded-lg bg-yellow-400 px-3 py-2 text-sm hover:cursor-pointer hover:bg-yellow-500"
          onClick={() => {
            setIsSearching(true);
            setSongToPlay(songSelection);
          }}
        >
          Change Song
        </button>
      </div>}
      {/* Get rid of the bangs later! */}
    </div>
  );
}

export default RegularSpotifyPlayer;
