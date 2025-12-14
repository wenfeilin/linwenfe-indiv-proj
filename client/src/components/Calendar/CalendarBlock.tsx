import { useParams, Link, useLocation } from "react-router";
import { useEntries } from "../../contexts/EntriesContext";
import { Flower2, Music } from "lucide-react";

function CalendarBlock({ blockDate }: { blockDate: Date }) {
  // Use date prop to find proper entry's song selection to render (and figure out if it is filled
  // in or not) and the day number
  const blockDay = blockDate.getDate();

  // Style the block according to if it's in the month or not (month determined by URL params)
  const { month } = useParams();
  const calendarMonth = +month!;
  const blockMonth = blockDate.getMonth() + 1; // add 1 b/c month is 0-indexed
  const isInCurrMonth = blockMonth === calendarMonth;

  // Differentiate the style of the block that is the current day from the others.
  const now = new Date();
  const today = now.getDate();
  const currMonth = now.getMonth() + 1; // add 1 b/c month is 0-indexed
  const currYear = now.getFullYear();

  const blockYear = blockDate.getFullYear();

  const isToday =
    blockDay === today &&
    isInCurrMonth &&
    blockMonth == currMonth &&
    currYear === blockYear;

  // Info to go back to appropriate calendar after clicking on entry.
  const location = useLocation();

  // Visually indicate if there is an entry for the block.
  const entries = useEntries();
  const blockEntry = entries.find(
    (entry) => entry.date === `${blockYear}-${blockMonth}-${blockDay}`,
  );
  const hasEntry = blockEntry ? true : false;

  // Visually indicate if the entry has a song selection.
  const hasSongSelection = blockEntry ? (blockEntry.songSelection ? true : false)  : false;

  return (
    // Clicking on it should link to the entry view of the entry associated w/ the date.
    <Link
      to={`/entry/${blockYear}/${blockMonth}/${blockDay}`}
      state={{ prevPage: location.pathname }}
      data-testid="calendar-block-wrapper"
      className=""
      onClick={(event) => {
        if (!isInCurrMonth) {
          event.preventDefault();
        }
      }}
    >
      <div
        data-testid="calendar-block"
        className={`text-sm flex flex-col gap-5 py-2 px-1.5
           md:text-base md:gap-3 md:py-0.5 md:pb-2
          ${isInCurrMonth ? "bg-white text-gray-900 hover:bg-amber-200" : "bg-gray-500 text-gray-300 cursor-default"} ${isToday && "bg-yellow-300 hover:bg-yellow-400"}`}
      >
        <div data-testid="day-number" className={`inline-block row-start-1 text-center md:text-left`}>
          {blockDay}
        </div>

        {/* Make every block have the icon so that even the gray ones at the end of the calendar have the same height as the other calendar blocks. */}
        <div className="row-start-2 flex justify-center items-center md:flex-col">
          <div className="relative 
            lg:w-full lg:flex lg:justify-center">

            <Flower2 data-testid="entry-indicator" className={`w-5 h-auto lg:w-1/5 xl:w-1/6 fill-rose-200 stroke-pink-600 ${hasEntry && isInCurrMonth? "" : "invisible"}`} strokeWidth={1.75} />

            <Music data-testid="song-indicator" className={`w-3.5 h-auto stroke-purple-500 absolute -top-4 left-1/2 -translate-x-1/2 
              md:w-4 md:-top-3.75 md:translate-x-0 md:left-4.75 md:rotate-1  
              lg:w-4.5 lg:-top-5 lg:left-6/10 lg:rotate-1 
              ${hasSongSelection && isInCurrMonth? "" : "invisible"}`} strokeWidth={2} />
          </div>
          
        </div>
      </div>
    </Link>
  );
}

export default CalendarBlock;
