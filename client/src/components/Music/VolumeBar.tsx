import { useRef } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

// volume = curr volume from music player
function VolumeBar({volume, isDisabled}:{volume: number, isDisabled: boolean}) {

  // Check the pointer type (coarse = touch input)
  // const onMobileDevice = window.matchMedia("(pointer: coarse").matches;

  const minVolume = 0;
  const maxVolume = 1;

  // Only apply the smooth transition of the volume bar when not resetting it.
  // const applyTransition = volume? volume >= 0: false;

  const musicPlayer = useMusicPlayer();
  const isScrubbingVolume = useRef(false);



  // IF DOING TWO SEPARATE VOLUME BARS, CHANGE THIS TO MIRROR CHANGES MADE IN PROGRESSBAR
  

  // Mouse down on the range input = started scrubbing.
  function handleMouseDown() {
    if (musicPlayer) {
      if (musicPlayer.playerModeRef.current === "entry") {
        musicPlayer.playerModeRef.current = "entry";
      } else {
        musicPlayer.playerModeRef.current = "calendar";
      }
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
    volumeIcon = <Volume2 data-testid="high-vol-icon" size={volumeIconSize} />
  } else if (volume >= 0.25) { // 25-74% = medium volume
    volumeIcon = <Volume1 data-testid="med-vol-icon" size={volumeIconSize} />
  } else if (volume > 0) {// 1-24% = low volume
    volumeIcon = <Volume data-testid="low-vol-icon" size={volumeIconSize} />
  } else { // 0% = no volume
    volumeIcon = <VolumeX data-testid="muted-vol-icon" size={volumeIconSize} />
  }

  return(
    <div data-testid="volume-bar-container" className="flex items-center gap-2">
      {/* Volume Icon */}
      {volumeIcon}

      {/* The actual volume bar */}
      <input type="range" data-testid="volume-bar" id="volumeBar" min={minVolume} max={maxVolume} step="0.01" value={volume}
      className="flex-1"
      onChange={(event) => handleChange(event)}
      onMouseDown={handleMouseDown} // for mouse (desktop/latop)
      onMouseUp={handleMouseUp} // for mouse (desktop/latop)
      disabled={isDisabled}
      />
    </div>
  )
}

export default VolumeBar;