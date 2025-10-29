import { useEffect, useState } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import DatePicker from "react-datepicker";
import { getDateParts, getMonthName } from "../../utils/date";
import VolumeBar from "./VolumeBar";
import ProgressBar from "./ProgressBar";
import { ColorRing } from "react-loader-spinner";
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
  const [errorMsg, setErrorMsg] = useState("");

  const [currSongEntryDate, setCurrSongEntryDate] = useState<string | null>(null);
  const [queuedSongsAndDates, setQueuedSongsAndDates] = useState<SongsAndDates | null>(null);

  const musicPlayer = useMusicPlayer();
  const entriesByDate = useEntriesSortedByDate();

  // Initially disable this player if either entry player is being used or the user has not selected a month's songs to play.
  const [isPlayingDisabled, setIsPlayingDisabled] = useState<boolean>((musicPlayer? musicPlayer.playerModeRef.current === "entry" : true) || monthPlaying? false : true);
  
  async function queueAndPlaySongs() {
    // Filter for selected month's songs.
    const monthSongs = entriesByDate.filter((entry) => {
      const dateParts = getDateParts(entry.date);
      const entryMonth = dateParts[1];

      return (entryMonth === selectedMonth!.getMonth() + 1) && entry.songSelection;
    });

    const monthSongUris = monthSongs.map((entry) => entry.songSelection!.uri);
    
    if (monthSongUris.length === 0) {
      setErrorMsg(`You have no songs for ${getMonthName(selectedMonth!.getMonth() + 1)} ${selectedMonth!.getFullYear()}.`);
      setIsPlayingDisabled(true);
      return;
    }

    // Get and save the song URIs and their associated entry dates.
    const monthSongsAndDates = monthSongs.map((entry) => ({songUri: entry.songSelection!.uri, date: entry.date}));
    setQueuedSongsAndDates(monthSongsAndDates);

    await musicPlayer!.queueAndPlaySongs(monthSongUris, 0);
    setIsPlayingDisabled(false);
  }

  // let currSongEntryDate = ""





  // CHECKPT: this don't work.


  // Determine which entry the song being played is from.
  useEffect(() => {
    const getSongEntryDate = async () => {
      if (musicPlayer?.playerModeRef.current === "calendar" && queuedSongsAndDates) {
        try {
          const songPosition = await musicPlayer.determineSongPosition();
          // console.log("pos", songPosition)
          if (typeof songPosition === "number") {
            const currDate = queuedSongsAndDates? queuedSongsAndDates[songPosition].date : "";
            const [year, month, day] = getDateParts(currDate);
            setCurrSongEntryDate(`${month}/${day}/${year}`);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getSongEntryDate();
  }, [musicPlayer])

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
  
  return (
    <div className={`${containerStyles}`}>
      <DatePicker
        className="rounded border-2 text-center inline-block lg:w-full"
        selected={selectedMonth}
        dateFormat="MMM yyyy"
        showMonthYearPicker
        popperPlacement="bottom"
        popperClassName=""
        
        onChange={(date) => setSelectedMonth(date)}
      ></DatePicker>

      {musicPlayer?.isReady? 
        <button 
          disabled={selectedMonth? false : true}
          onClick={async () => {
            if (selectedMonth) {
              setMonthPlaying(selectedMonth);
              
              // Switch to calendar player context and pause the entry player.
              if (musicPlayer.playerModeRef.current === "calendar") {
                musicPlayer.previouslyPlayedModeRef.current = "calendar";
              } else {
                musicPlayer.previouslyPlayedModeRef.current = "entry";
              }

              musicPlayer.playerModeRef.current = "calendar";
              musicPlayer.setIsPlaying(false);
              musicPlayer.resetProgress("entry");

              // musicPlayer.setCurrentContext(null);

              // Reset any error ("no songs this month") messages.
              setErrorMsg("");

              await queueAndPlaySongs();
            }
          }}>
          START
        </button> : 
        <ColorRing colors={["#25c21d", "#25c21d", "#25c21d", "#25c21d", "#25c21d"]} height={42} />}

      {errorMsg && <p>{errorMsg}</p>}

      <div className="flex gap-2">
        {/* Album Cover */}
        {
          // FIX THIS EMPTY DIV SIZING WHEN THERE IS NO SONG SELECTED/PRESSED FOR PLAYING

          <div
            className={`h-20 w-1/2 rounded border-2 ${!currSong && "bg-gray-100"}`}
          >
            {currSong && (
              <img
                src={currSong?.album.images[2].url} // I hope there is an image here.
                alt={`Cover of the album ${currSong?.album}`}
                className="rounded border-2 border-transparent"
              ></img>
            )}
          </div>
        }

        {/* Song Info */}
        <div className="flex flex-col gap-1 pt-1 text-sm">
          <p>{currSong?.name}</p>
          <p className="text-gray-500">{currSongArtists}</p>
          {currSongEntryDate && <p>from {currSongEntryDate} entry</p>}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        {(musicPlayer?.isReady && !(musicPlayer?.isLoadingSongGlobal)) ?
          // Play/Pause Button
          (<>
            <button 
              className="p-1 hover:cursor-pointer hover:opacity-80 disabled:hover:opacity-100"
              disabled={isPlayingDisabled}
              onClick={() => musicPlayer.prevSong()}
            >
              <SkipBack fill="black" />
            </button>
          
            <button
              className="p-1 hover:cursor-pointer hover:opacity-80 disabled:hover:opacity-100"
              disabled={isPlayingDisabled}
              onClick={async () => {
                // only if the play/pause button is not disabled
                if (!isPlayingDisabled) { 
                  if (musicPlayer.playerModeRef.current === "calendar") {
                    musicPlayer.previouslyPlayedModeRef.current ="calendar";
                  } else {
                    musicPlayer.previouslyPlayedModeRef.current ="entry";
                  }
                  musicPlayer.playerModeRef.current = "calendar";
                  musicPlayer.resetProgress("entry");

                  const monthSongUris = queuedSongsAndDates?.map((songAndDate) => songAndDate.songUri);
                  await musicPlayer.togglePlayGlobal(monthSongUris!); // add currSongPos param
                  // musicPlayer.setCurrentContext(null);
                }
              }}
            >
              {musicPlayer!.isPlayingGlobal ? <Pause fill="black" /> : <Play fill="black" />}
            </button>
            
            <button 
              className="p-1 hover:cursor-pointer hover:opacity-80 disabled:hover:opacity-100"
              disabled={isPlayingDisabled}
              onClick={() => musicPlayer.nextSong()}
            >
              <SkipForward fill="black" />
            </button>
          </>) :
          (<ColorRing colors={["#25c21d", "#25c21d", "#25c21d", "#25c21d", "#25c21d"]} height={42} />)
        }
      </div>

      <ProgressBar
        progress={musicPlayer!.progressGlobal}
        songDuration={currSong ? currSong.duration_ms : 1}
        playerType="calendar"
        isDisabled={monthPlaying? false : true}
      ></ProgressBar>
      
      {/* Volume Bar */}
      {/* According to Spotify Web Playback SDK, mobile devices must control the volume through hardware, so don't render the volume bar! */}
      {!onMobileDevice && 
        <VolumeBar
          volume={musicPlayer!.volume}
        ></VolumeBar>
      }

    </div>
  )
}

export default GlobalSpotifyPlayer;
