function ProgressBar({progress, songDuration}:{progress: number, songDuration: number}) {
  const progressPercentage = (progress / songDuration) * 100;
  
  const progressDurationInSeconds = progress / 1000;
  const songDurationInSeconds = songDuration / 1000;

  const progressMinutesTimestamp = Math.floor(progressDurationInSeconds / 60);
  const progressSecondsTimestamp = String(Math.floor(progressDurationInSeconds % 60)).padStart(2, "0");

  const songDurMinutesTimestamp = Math.floor(songDurationInSeconds / 60);
  const songDurSecondsTimestamp = String(Math.floor(songDurationInSeconds % 60)).padStart(2, "0");
 
  return(
    <div className="flex items-center gap-2">
      <p className="text-sm">{progressMinutesTimestamp}:{progressSecondsTimestamp}</p>
      <div className="flex-1 border-1 rounded-lg h-2">
        <div className={`bg-green-500 h-full transition-all rounded-lg`} style={{width: `${progressPercentage}%`}}></div>
      </div>
      <p className="text-sm">{songDurMinutesTimestamp === 0 && +songDurSecondsTimestamp === 0 ? "--:--" : `${songDurMinutesTimestamp}:${songDurSecondsTimestamp}`}</p>
    </div>
  )
}

export default ProgressBar;