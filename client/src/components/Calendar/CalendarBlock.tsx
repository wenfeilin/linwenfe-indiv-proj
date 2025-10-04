import { useParams } from 'react-router';

function CalendarBlock({date}: {date: Date}) {
  // Use date prop to find proper entry's song selection to render (and figure out if it is filled 
  // in or not) and the day number
  const dayDate = date.getDate();

  // Clicking on it should link to the entry view of the entry associated w/ the date.
  // <Link></Link>

  // Style the block according to if it's in the month or not (month determined by URL params)
  const { month } = useParams();
  const blockMonth = date.getMonth() + 1;
  const isInCurrMonth = blockMonth == +month!;

  return ( 
    <div className={`w-16 h-16 ${isInCurrMonth? "" :"bg-gray-500 text-gray-300"}`}>
      {dayDate}
    </div>
  );

}

export default CalendarBlock;