import { useParams, Link, useLocation } from "react-router";
import { useEntries } from "../../contexts/EntriesContext";

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

  return (
    // Clicking on it should link to the entry view of the entry associated w/ the date.
    // <Link></Link>
    <Link
      to={`/entry/${blockYear}/${blockMonth}/${blockDay}`}
      state={{ prevPage: location.pathname }}
      onClick={(event) => {
        if (!isInCurrMonth) {
          event.preventDefault();
        }
      }}
    >
      <div
        className={`h-21 pt-0.5 pl-1.5 ${isInCurrMonth ? "bg-white text-gray-900 hover:bg-amber-200" : "bg-gray-500 text-gray-300 cursor-default"} ${isToday && "bg-yellow-300 hover:bg-yellow-400"}`}
      >
        <div className={`inline-block`}>{blockDay}</div>
        {hasEntry && isInCurrMonth && <p>Entry exists</p>}
      </div>
    </Link>
  );
}

export default CalendarBlock;
