import type { Song } from "./SongSelection";
import { Pause, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { ColorRing } from "react-loader-spinner";
import { useEffect } from "react";

function RegularSpotifyPlayer({
  songSelection,
  isEditing,
  isAddSongBtnActive,
  setIsSearching,
}: {
  songSelection: Song | null;
  isEditing: boolean;
  isAddSongBtnActive: boolean;
  setIsSearching: (isSearching: boolean) => void;
}) {
  const musicPlayer = useMusicPlayer();
  musicPlayer?.setCurrentTrack(songSelection);

  // console.log("Currently going to play", musicPlayer?.currentTrack?.title, "by", musicPlayer?.currentTrack?.artists);

  // console.log("is playing?", musicPlayer?.isPlaying)

  return (
    // MAKE SURE NOTHING IS PRESSABLE UNTIL THE PLAYER IS LOADED!! -- this behavior isn't determinate rn

    <div className="mb-1 flex flex-col gap-6 rounded-lg border-2 p-2 pb-4">
      <div className="flex gap-2">
        {/* Album Cover */}
        {
          // FIX THIS EMPTY DIV SIZING WHEN THERE IS NO SONG SELECTED/PRESSED FOR PLAYING

          <div
            className={`h-20 w-1/2 rounded border-2 ${!songSelection && "bg-gray-100"}`}
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
        {musicPlayer?.isReady? 
          // Play/Pause Button
          (<button
            className="p-1 hover:cursor-pointer hover:opacity-80"
            disabled={!(musicPlayer?.isReady)}
            onClick={async () => {
              if (musicPlayer) {
                console.log("Currently playing", songSelection);

                musicPlayer.togglePlay();
                musicPlayer.setIsPlaying(!musicPlayer.isPlaying);
              }
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
      ></ProgressBar>

      {(isAddSongBtnActive && isEditing) && <div className="flex justify-center">
        <button
          className="rounded-lg bg-yellow-400 px-3 py-2 text-sm hover:cursor-pointer hover:bg-yellow-500"
          onClick={() => {
            setIsSearching(true);
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
