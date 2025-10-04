import {useParams, Link, Navigate} from 'react-router';
import Calendar from '../components/Calendar/Calendar';

function CalendarPage() {
  const now = new Date();
  let { year, month } = useParams(); // The month here is not 0-indexed.

  // .getMonth() returned 0-based months.
  const currMonth = now.getMonth() + 1;
  const currYear = now.getFullYear();

  // By default, redirect user to calendar for current month and year.
  if (month === undefined || year === undefined) {
    return <Navigate to={`/my-calendar/${currYear}/${currMonth}`}></Navigate>
  }

  const displayedMonth = Number(month);
  const displayedYear = Number(year);

  // Ensure that the prev month of a date at the first month of the year, like Jan, 2025, is the 
  // last month of the previous year, like Dec, 2024.
  const prevMonth = displayedMonth === 1? 12 : displayedMonth - 1;
  const prevYear = displayedMonth === 1? displayedYear - 1 : displayedYear;

  // Ensure that the next month of a date at the last month of the year, like Dec, 2025, is the 
  // first month of the next year, like Jan, 2026
  const nextMonth = displayedMonth === 12? 1 : displayedMonth + 1;
  const nextYear = displayedMonth === 12? displayedYear + 1 : displayedYear;

  return(
    <div className="flex flex-col items-center">
      <div>
        {/* Move to Calendar component prob */}
        <Link to={`/my-calendar/${prevYear}/${prevMonth}`}>◄</Link>
        <Link to={`/my-calendar/${nextYear}/${nextMonth}`}>►</Link>
      </div>
        <Calendar></Calendar>
    </div>
  );
}

export default CalendarPage;