import type { Song } from "./SongSelection";
import { Pause, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { ColorRing } from "react-loader-spinner";
import { useEffect } from "react";

// Handles UI rendering and UI-related functionality for music player in entry view
function MiniSpotifyPlayer({
  currentTrackToPlay,
  isAddSongBtnActive,
}: {
  currentTrackToPlay: Song | null;
  isAddSongBtnActive: boolean;
}) {
  const musicPlayer = useMusicPlayer();
  musicPlayer?.setCurrentTrack(currentTrackToPlay);

  console.log("Currently going to play", musicPlayer?.currentTrack?.title, "by", musicPlayer?.currentTrack?.artists);

  const albumImageSrc = currentTrackToPlay?.albumCoverUrls[2];

  // When the song being played is changed, reset the visual and actual progress of the music if there is any.
  useEffect(() => {
    return () => {
      // This makes the progress bar reset instantly with no animation.
      musicPlayer?.resetProgress();
    }
  }, [albumImageSrc])

  return (
    // MAKE SURE NOTHING IS PRESSABLE UNTIL THE PLAYER IS LOADED!! -- this behavior isn't determinate rn

    <div className="mb-1 rounded-lg border-2 p-2 pb-0 flex flex-col gap-2">
      <div className="flex gap-2 pr-2">
        {/* Album Cover */}
        <div
          className={`h-15 w-20 rounded border-2 ${!currentTrackToPlay && "bg-gray-100"}`}
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
            <p>{currentTrackToPlay?.title}</p>
            <p className="text-gray-500">{currentTrackToPlay?.artists}</p>
          </div>

          <div className="flex items-center">
            {musicPlayer?.isReady? 
              // Play/Pause Button 
              (<button className="hover:cursor-pointer hover:opacity-80"
                disabled={currentTrackToPlay? false : true}
                onClick={async () => {
                  if (musicPlayer) {
                    await musicPlayer.togglePlay();
                    // Need this for the player to look visually paused immediately.
                    musicPlayer.setIsPlaying(!musicPlayer.isPlaying);
                  }
                }}
              >
                {musicPlayer!.isPlaying? <Pause fill="black" /> : <Play fill="black" />}
              </button>) : 
              (<ColorRing colors={["#25c21d", "#25c21d", "#25c21d", "#25c21d", "#25c21d"]} height={42} />)
            }
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        progress={musicPlayer!.progress}
        songDuration={currentTrackToPlay ? currentTrackToPlay.durationMS : 1}
      ></ProgressBar>
      <div>{/* Get rid of the bangs later! */}</div>
    </div>
  );
}

export default MiniSpotifyPlayer;
