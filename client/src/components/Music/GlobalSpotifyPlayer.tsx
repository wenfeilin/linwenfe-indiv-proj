import { useEffect, useState } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import DatePicker from "react-datepicker";
import { getDateParts, getMonthName } from "../../utils/date";
import VolumeBar from "./VolumeBar";
import ProgressBar from "./ProgressBar";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import useEntriesSortedByDate from "../../hooks/useEntriesSortedByDate";

export type SongsAndDates = {
  songUri: string,
  date: string,
}[]

function GlobalSpotifyPlayer({containerStyles}: {containerStyles: string}) {
  // Don't initialize selected month as a month.
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  // The month that the player is playing (not necessarily the one selected but could be). (So this can be displayed on the player and saved for later?)
  const [monthPlaying, setMonthPlaying] = useState<Date | null>(null);

  const [currSong, setCurrSong] = useState<Spotify.Track | null>(null);
  // For if songs were queued properly.
  const [successMsg, setSuccessMsg] = useState("Pick a month to play from");
  const [prevSuccessMsg, setPrevSuccessMsg] = useState(successMsg); // a valid one (either "pick a month" or "now playing")

  const [currSongEntryDate, setCurrSongEntryDate] = useState<string | null>(null);
  const [queuedSongsAndDates, setQueuedSongsAndDates] = useState<SongsAndDates | null>(null);

  const musicPlayer = useMusicPlayer();
  const entriesByDate = useEntriesSortedByDate();

  // Initially disable this player if either entry player is being used or the user has not selected a month's songs to play.
  const [isPlayingDisabled, setIsPlayingDisabled] = useState<boolean>((musicPlayer? musicPlayer.playerModeRef.current === "entry" : true) || monthPlaying? false : true);

  // const [isPlayBtnsDisabled, setIsPlayBtnsDisabled] = useState(true);
  // const [isPlayerBarsDisabled, setIsPlayerBarsDisabled] = useState(true); // the progress and volume bars
  
  async function queueAndPlaySongs() {
    // Filter for selected month's songs.
    const monthSongs = entriesByDate.filter((entry) => {
      const dateParts = getDateParts(entry.date);
      const entryMonth = dateParts[1];

      return (entryMonth === selectedMonth!.getMonth() + 1) && entry.songSelection;
    });

    const monthSongUris = monthSongs.map((entry) => entry.songSelection!.uri);
    
    if (monthSongUris.length === 0) {
      // Only save the previous message if it was a valid one.
      if (!successMsg.includes("No songs")) {
        setPrevSuccessMsg(successMsg);
      }

      setSuccessMsg(`No songs for ${getMonthName(selectedMonth!.getMonth() + 1)?.substring(0, 3)} ${selectedMonth!.getFullYear()}`);
      // setIsPlayingDisabled(true);
      return;
    }

    // Get and save the song URIs and their associated entry dates.
    const monthSongsAndDates = monthSongs.map((entry) => ({songUri: entry.songSelection!.uri, date: entry.date}));
    setQueuedSongsAndDates(monthSongsAndDates);

    // Switch to calendar player context (and pause the entry player).
    await musicPlayer!.updatePlayerState("calendar");

    setMonthPlaying(selectedMonth);
    await musicPlayer!.queueAndPlaySongs(monthSongUris, 0);
    setSuccessMsg(`Now playing ${getMonthName(selectedMonth!.getMonth() + 1)?.substring(0, 3)} ${selectedMonth!.getFullYear()}`);
    setIsPlayingDisabled(false);
  }

  // let currSongEntryDate = ""
  const isUnplayableMonth = successMsg.includes("Pick") || successMsg.includes("No songs");
  // console.log(isUnplayableMonth)


  // Reset the status/success message after 5 seconds if it displayed that the attempt to queue a month w/ no songs was unsuccessful.
  useEffect(() => {
    if (isUnplayableMonth) {
      const timer = setTimeout(() => {
        setSuccessMsg(prevSuccessMsg);
      }, 5000);

      // Cleanup the timer on unmount.
      return () => clearTimeout(timer);
    }
  }, [successMsg]);


  // CHECKPT: this don't work.


  // Determine which entry the song being played is from.
  // useEffect(() => {
  //   const getSongEntryDate = async () => {
  //     if (musicPlayer?.playerModeRef.current === "calendar" && queuedSongsAndDates) {
  //       try {
  //         const songPosition = await musicPlayer.determineSongPosition();
  //         // console.log("pos", songPosition)
  //         if (typeof songPosition === "number") {
  //           const currDate = queuedSongsAndDates? queuedSongsAndDates[songPosition].date : "";
  //           const [year, month, day] = getDateParts(currDate);
  //           setCurrSongEntryDate(`${month}/${day}/${year}`);
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   };

  //   getSongEntryDate();
  // }, [musicPlayer])

  // INDICATE WHICH ENTRY THE SONG IS FROM SOMEHOW






  // make this initially null so that it doesn't show the song from Spotify that the user was previously playing prior to using this app.

  useEffect(() => {
    // 
    if (musicPlayer && monthPlaying) {
      if (musicPlayer.playerModeRef.current === "calendar") {
        setCurrSong(musicPlayer.currentSong ?? null);
      }
    }
  }, [musicPlayer?.currentSong])

  // const currSong = musicPlayer?.currentSong;
  let currSongArtists = "";

  if (currSong) {
    const currSongArtistsList = currSong.artists.map((artist) => artist.name);
    currSongArtists = currSongArtistsList.reduce(
      (names, artistName) => (names += `${artistName}, `),
      "",
    );
    currSongArtists = currSongArtists.slice(0, currSongArtists.length - 2);
  }

  // Check the pointer type (coarse = touch input)
  const onMobileDevice = window.matchMedia("(pointer: coarse").matches;

  const playBtnStyles = "p-1 border-2 rounded hover:cursor-pointer hover:opacity-80 disabled:hover:cursor-default disabled:hover:opacity-100"
  
  return (
    <div className={`${containerStyles}`}>
      <div className={`border-2 rounded-lg p-3`}>
        <div className="flex mb-2 justify-between">
          <div className="flex gap-2 items-center min-h-fit">
            {/* Date Picker */}
            <div className="">
              <DatePicker
                className="rounded border-2 text-center w-28"
                selected={selectedMonth}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                popperPlacement="top-start"
                popperClassName=""
      
                onChange={(date) => setSelectedMonth(date)}
                ></DatePicker>
            </div>
      
            {/* START button */}
            <button
            className="bg-green-600 px-4 py-0.75 rounded font-bold text-white disabled:text-gray-300  disabled:bg-gray-600 disabled:opacity-65 hover:cursor-pointer hover:disabled:cursor-default"
            disabled={musicPlayer?.isReady && selectedMonth? false : true}
            onClick={async () => {
              if (selectedMonth) {
                // if (musicPlayer.playerModeRef.current === "calendar") {
                  //   musicPlayer.previouslyPlayedModeRef.current = "calendar";
                  // } else {
                    //   musicPlayer.previouslyPlayedModeRef.current = "entry";
                    // }
                    // musicPlayer.playerModeRef.current = "calendar";
                    // musicPlayer.setIsPlaying(false);
                    // musicPlayer.resetProgress("entry");
                    // musicPlayer.setCurrentContext(null);
                    // Reset any error ("no songs this month") messages.
                    setSuccessMsg("");
                    await queueAndPlaySongs();
                  }
                }}>
              START
            </button>
          </div>
          <div className="bg-gray-800 text-green-500 border-black text-sm border-2 rounded w-47 md:w-50 flex items-center justify-end pr-3">
            <p className="">{successMsg}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Album Cover */}
          <div
          className={`h-21 w-21 rounded border-2 flex-shrink-0 ${!currSong && "bg-gray-100"}`}
          >
            {currSong && (
              <img
              src={currSong?.album.images[2].url} // I hope there is an image here.
              alt={`Cover of the album ${currSong?.album}`}
              className="rounded border-2 border-transparent"
              ></img>
            )}
          </div>
      
          <div className={`flex-1 min-w-0`}>
            {/* Song Info */}
            <div className="h-1/2 flex flex-col pt-1 text-sm flex-shrink-1">
              <p className="truncate flex-shrink-1">{currSong?.name}</p>
              <p className="text-gray-500 truncate">{currSongArtists}</p>
              {/* {currSongEntryDate && <p>from {currSongEntryDate} entry</p>} */}
            </div>
      
            <ProgressBar
              progress={musicPlayer!.progressGlobal}
              songDuration={currSong ? currSong.duration_ms : 1}
              playerType="calendar"
              isDisabled={((musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal) && isPlayingDisabled) || musicPlayer?.playerModeRef.current === "entry" || musicPlayer?.playerModeRef.current === null) ?? true}
            ></ProgressBar>
      
            {/* Volume Bar */}
            {/* According to Spotify Web Playback SDK, mobile devices must control the volume through hardware, so don't render the volume bar! */}
            {!onMobileDevice &&
              <VolumeBar
                volume={musicPlayer!.volume}
                isDisabled={((musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal) && isPlayingDisabled) || musicPlayer?.playerModeRef.current === "entry" || musicPlayer?.playerModeRef.current === null) ?? true}
              ></VolumeBar>
            }
          </div>
          {/* Playing Buttons */}
          <div className="flex flex-col gap-2">
            {/* Play/Pause Button */}
            <button
              className={`${playBtnStyles} flex justify-center`}
              disabled={(musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal) && isPlayingDisabled) || musicPlayer?.playerModeRef.current === null}
              onClick={async () => {
                // only if the play/pause button is not disabled
                if (!isPlayingDisabled) {
                  musicPlayer!.updatePlayerState("calendar");
                  // if (musicPlayer.playerModeRef.current === "calendar") {
                  //   musicPlayer.previouslyPlayedModeRef.current ="calendar";
                  // } else {
                  //   musicPlayer.previouslyPlayedModeRef.current ="entry";
                  // }
                  // musicPlayer.playerModeRef.current = "calendar";
                  // musicPlayer.setIsPlaying(false);
                  // musicPlayer.resetProgress("entry");
                  const monthSongUris = queuedSongsAndDates?.map((songAndDate) => songAndDate.songUri);
                  await musicPlayer!.togglePlayGlobal(monthSongUris!); // add currSongPos param
                  // musicPlayer.setCurrentContext(null);
                }
              }}
            >
              {musicPlayer!.isPlayingGlobal ? <Pause fill="black" /> : <Play fill="black" />}
            </button>
      
            <div className="flex gap-1">
              {/* Skip Backward button */}
              <button
                className={`${playBtnStyles}`}
                disabled={(musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal) && isPlayingDisabled) || musicPlayer?.playerModeRef.current === null || musicPlayer?.playerModeRef.current === "entry"}
                onClick={async () => await musicPlayer!.prevSong()}
              >
                <SkipBack fill="black" />
              </button>

              {/* Skip Forward button */}
              <button
                className={`${playBtnStyles}`}
                disabled={(musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal) && isPlayingDisabled) || musicPlayer?.playerModeRef.current === null || musicPlayer?.playerModeRef.current === "entry"}
                onClick={async () => await musicPlayer!.nextSong()}
              >
                <SkipForward fill="black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The legs of the music player */}
      <div className="flex justify-between px-5 w-full">
        <div className="w-14 h-2 bg-yellow-900 rounded-b-xs">
        </div>

        <div className="w-14 h-2 bg-yellow-900 rounded-b-xs">
        </div>
      </div>
    </div>

  )
}

export default GlobalSpotifyPlayer;
