// So Spotify is recognized as a type
///  <reference types="@types/spotify-web-playback-sdk"/>
import { useState, useEffect, useRef } from "react";
import type { Song } from "./SongSelection";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer";
import ProgressBar from "./ProgressBar";

function SpotifyPlayer({
  currentTrackToPlay,
  isAddSongBtnActive,
}: {
  currentTrackToPlay: Song | null;
  isAddSongBtnActive: boolean;
}) {
  console.log("Currently going to play", currentTrackToPlay);

  const { playerRef, isPlaying, setIsPlaying, deviceId, isReady, progress } =
    useSpotifyPlayer(currentTrackToPlay, isAddSongBtnActive);

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
              src={currentTrackToPlay?.albumCoverUrls[2]}
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
            {/* Play/Pause Button */}
            <button className="hover:cursor-pointer hover:opacity-80"
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
      </div>

      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        songDuration={currentTrackToPlay ? currentTrackToPlay.durationMS : 1}
      ></ProgressBar>
      <div>{/* Get rid of the bangs later! */}</div>
    </div>
  );
}

export default SpotifyPlayer;
