import { useEffect, useRef } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

function ProgressBar({progress, songDuration}:{progress: number, songDuration: number}) {
  // const progressPercentage = (progress / songDuration) * 100;
  
  const progressDurationInSeconds = progress / 1000;
  const songDurationInSeconds = songDuration / 1000;

  const progressMinutesTimestamp = Math.floor(progressDurationInSeconds / 60);
  const progressSecondsTimestamp = String(Math.floor(progressDurationInSeconds % 60)).padStart(2, "0");

  const songDurMinutesTimestamp = Math.floor(songDurationInSeconds / 60);
  const songDurSecondsTimestamp = String(Math.floor(songDurationInSeconds % 60)).padStart(2, "0");

  // Only apply the smooth transition of the progress bar when not resetting it.
  const applyTransition = progress? progress >= 0: false;

  const musicPlayer = useMusicPlayer();
  
  // Run when progress and songDuration get updated.
  // useEffect(() => {
  //   if (musicPlayer) {
  //     // If currently dragging the progress bar on a loaded song.
  //     if (!musicPlayer.isScrubbing.current && songDuration > 0 && musicPlayer) {
  //       // Set the new progress, updating the timestamp (and position of the slider).
  //       musicPlayer.setProgress(progress);
  //     }

  //   }
  // }, [progress, songDuration])

  // Mouse down on the range input = started scrubbing.
  function handleMouseDown() {
    if (musicPlayer) {
      musicPlayer.isScrubbing.current = true;
    }
  }

  // When the progress is updated, update the slider position.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTime = +event.target.value;

    if (musicPlayer) {
      // Update the progress time of the song.
      musicPlayer.setProgress(newTime);
    }
  }

  // Mouse up = stopped scrubbing.
  function handleMouseUp () {
    if (musicPlayer) {
      musicPlayer.isScrubbing.current = false;
      // Seek to this new position after scrubbing.
      const timeToSeekTo = progress;
      musicPlayer.seek(timeToSeekTo);
    }
  }

  return(
    <div className="flex items-center gap-2">
      {/* Playing Timestamp */}
      <p className="text-sm">
        {progressMinutesTimestamp}:{progressSecondsTimestamp}
      </p>

      {/* The actual bar */}
      <input type="range" id="progressBar" min="0" max={songDuration} step="0.01" value={progress}
      className="flex-1"
      onChange={(event) => handleChange(event)}
      onMouseDown={handleMouseDown} // for mouse (desktop/latop)
      onMouseUp={handleMouseUp} // for mouse (desktop/latop)
      onTouchStart={handleMouseDown} // for touchscreen (mobile devices)
      onTouchEnd={handleMouseUp} // for touchscreen (mobile devices)
      />

      {/* <div className="flex-1 border-1 rounded-lg h-2">
        <div className={`bg-green-500 h-full ${applyTransition && `transition-all`} rounded-lg`} style={{width: `${progressPercentage}%`}}></div>
      </div> */}

      {/* Song Duration Timestamp */}
      <p className="text-sm">
        {songDurMinutesTimestamp === 0 && +songDurSecondsTimestamp === 0 ? "--:--" : `${songDurMinutesTimestamp}:${songDurSecondsTimestamp}`}
      </p>

    </div>
  )
}

export default ProgressBar;