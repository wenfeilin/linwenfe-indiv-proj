import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

function CancelButton({ onCancel }: { onCancel: () => void }) {
  const musicPlayer = useMusicPlayer();

  return (
    <>
      <button
        className="rounded-md bg-gray-400 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-gray-500"
        onClick={() => {
          onCancel();

          // Stop music from playing if any.
          if (musicPlayer && musicPlayer.isPlaying) {
            musicPlayer.togglePlay();
          }
        }}
      >
        Cancel
      </button>
    </>
  );
}

export default CancelButton;
