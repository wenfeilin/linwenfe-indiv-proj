import type { Song } from "./SongSelection";
import { Pause, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { ColorRing } from "react-loader-spinner";
import VolumeBar from "./VolumeBar";
import { isMobileDevice } from "../../utils/device";

// Handles UI rendering and UI-related functionality for music player in entry view
function MiniSpotifyPlayer({
  currentTrackToPlay,
  /*isAddSongBtnActive,
  songSelection, // selected but unsaved (b/c in edit mode)
  savedSongSelection,*/
}: {
  currentTrackToPlay: Song | null;
}) {
  const musicPlayer = useMusicPlayer();
  // musicPlayer?.setCurrentTrack(currentTrackToPlay);

  const albumImageSrc = currentTrackToPlay?.albumCoverUrls[2];
  // console.log("orig album img", albumImageSrc);

  // When the song being played is changed, reset the visual and actual progress of the music if there is any.
  // useEffect(() => {
  //   return () => {
  //     console.log("in useEffect")
  //     console.log("current track to play", currentTrackToPlay?.title)
  //     console.log("saved song selection:", savedSongSelection?.title)
  //     // Only reset the progress if the album cover is not for the saved song selection (if there is one) or is not for the unsaved song selection (if the entry does not have a saved song selection).
  //     if (savedSongSelection) {
  //       console.log("gotem")
  //       console.log("song selected (unsaved):", songSelection!.title);
  //       if (currentTrackToPlay?.uri !== savedSongSelection.uri || songSelection!.uri !== savedSongSelection.uri) {
  //         // This makes the progress bar reset instantly with no animation.
  //         musicPlayer?.resetVisualProgress();
  //       }
  //     } else {
  //       if (currentTrackToPlay?.uri !== songSelection?.uri || songSelection) {
  //         // This makes the progress bar reset instantly with no animation.
  //         musicPlayer?.resetVisualProgress();
  //       }
  //     }
  //   }
  // }, [currentTrackToPlay])

  // IDK if this is the best place to check this; maybe it should be higher up  (in the component tree, like when the musicPlayer is loaded) idk
  // Check the pointer type (coarse = touch input)
  const onMobileDevice = isMobileDevice();

  return (
    // MAKE SURE NOTHING IS PRESSABLE UNTIL THE PLAYER IS LOADED!! -- this behavior isn't determinate rn

    <div className="mb-1 rounded-lg border-2 p-2 pb-0 flex flex-col gap-2 ">
      <div className="flex gap-2 pr-2">
        {/* Album Cover */}
        <div
          className={`h-15 w-20 rounded border-2 ${!currentTrackToPlay && "bg-gray-100"}`}
          data-testid="album-cover-wrapper"
        >
          {currentTrackToPlay && (
            <img
              src={albumImageSrc}
              alt={`Cover of the album ${currentTrackToPlay?.album}`}
              className="h-14 rounded border-2 border-transparent"
            ></img>
          )}
        </div>

        <div className="flex w-full justify-between">
          {/* Song Info */}
          <div className="flex flex-col text-sm">
            <p data-testid="mini-player-song-title">{currentTrackToPlay?.title}</p>
            <p data-testid="mini-player-song-artist" className="text-gray-500">{currentTrackToPlay?.artists}</p>
          </div>

          <div className="flex items-center">
            {(musicPlayer?.isReady && !(musicPlayer?.isLoadingSong))? 
              // Play/Pause Button 
              (<button className="hover:cursor-pointer hover:opacity-80"
                disabled={currentTrackToPlay? false : true}
                onClick={async () => {
                  // Switch to entry player context (and pause the calendar player).
                  musicPlayer.updatePlayerState("entry");
                  // musicPlayer.previouslyPlayedModeRef.current = musicPlayer.playerModeRef.current;
                  // musicPlayer.playerModeRef.current = "entry";
                  // musicPlayer.resetVisualProgress("calendar");
                  // musicPlayer.setIsPlayingGlobal(false);
                  
                  // Resume/pause song.
                  await musicPlayer.togglePlay();
                }}
              >
                {musicPlayer!.isPlaying? <Pause fill="black" /> : <Play fill="black" />}
              </button>) : 
              (<ColorRing colors={["#25c21d", "#25c21d", "#25c21d", "#25c21d", "#25c21d"]} width={30} height={30}/>)
            }
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        progress={musicPlayer!.progress}
        songDuration={currentTrackToPlay ? currentTrackToPlay.durationMS : 1}
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
    </div>
  );
}

export default MiniSpotifyPlayer;
