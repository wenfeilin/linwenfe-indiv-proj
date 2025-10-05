import { useParams } from 'react-router';

function CalendarBlock({blockDate}: {blockDate: Date}) {
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

  const isToday = (blockDay === today) && isInCurrMonth && (blockMonth == currMonth) && 
                  (currYear === blockYear);

  return ( 
    // Clicking on it should link to the entry view of the entry associated w/ the date.
    // <Link></Link>
    <div className={`h-21 pt-0.5 pl-1.5 
                     ${isInCurrMonth? "bg-white text-gray-900" :"bg-gray-500 text-gray-300"} 
                     ${isToday && "bg-yellow-300"}`}>
      <div className={`inline-block`}>
        {blockDay}
      </div>
    </div>
  );

}

export default CalendarBlock;