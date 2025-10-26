import { useRef } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

// volume = curr volume from music player
function VolumeBar({volume}:{volume: number}) {

  // Check the pointer type (coarse = touch input)
  const onMobileDevice = window.matchMedia("(pointer: coarse").matches;

  const minVolume = 0;
  const maxVolume = 1;

  // Only apply the smooth transition of the volume bar when not resetting it.
  // const applyTransition = volume? volume >= 0: false;

  const musicPlayer = useMusicPlayer();
  const isScrubbingVolume = useRef(false);

  // Mouse down on the range input = started scrubbing.
  function handleMouseDown() {
    if (musicPlayer) {
      isScrubbingVolume.current = true;
    }
  }

  // When the volume is updated, update the slider position.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = +event.target.value;

    if (musicPlayer) {
      // Update the volume time of the song.
      musicPlayer.setPlayerVolume(newVolume);
    }
  }

  // Mouse up = stopped scrubbing.
  function handleMouseUp () {
    if (musicPlayer) {
      isScrubbingVolume.current = false;
      // Seek to this new position after scrubbing.
      const newVolume = volume;
      musicPlayer.setPlayerVolume(newVolume);
    }
  }

  let volumeIcon;
  const volumeIconSize = 20;

  // Determine volume icon
  if (volume >= 0.75) { // 75-100% = high volume
    volumeIcon = <Volume2 size={volumeIconSize} />
  } else if (volume >= 0.25) { // 25-74% = medium volume
    volumeIcon = <Volume1 size={volumeIconSize} />
  } else if (volume > 0) {// 1-24% = low volume
    volumeIcon = <Volume size={volumeIconSize} />
  } else { // 0% = no volume
    volumeIcon = <VolumeX size={volumeIconSize} />
  }

  console.log(volume);

  return(
    <div className="flex items-center gap-2">
      {/* Volume Icon */}
      {volumeIcon}

      {/* The actual volume bar */}
      <input type="range" id="volumeBar" min={minVolume} max={maxVolume} step="0.01" value={volume}
      className="flex-1"
      onChange={(event) => handleChange(event)}
      onMouseDown={handleMouseDown} // for mouse (desktop/latop)
      onMouseUp={handleMouseUp} // for mouse (desktop/latop)
      />
    </div>
  )
}

export default VolumeBar;