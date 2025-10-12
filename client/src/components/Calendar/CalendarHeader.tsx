import { Link, Navigate, useParams } from "react-router";
import { getMonthName } from "../../utils/date";

function CalendarHeader() {
  const now = new Date();
  let { year, month } = useParams(); // The month here is not 0-indexed.

  // .getMonth() returned 0-based months.
  const currMonth = now.getMonth() + 1;
  const currYear = now.getFullYear();

  // By default, redirect user to calendar for current month and year.
  if (month === undefined || year === undefined) {
    return <Navigate to={`/my-calendar/${currYear}/${currMonth}`}></Navigate>;
  }

  const displayedMonth = Number(month);
  const displayedYear = Number(year);

  // Ensure that the prev month of a date at the first month of the year, like Jan, 2025, is the
  // last month of the previous year, like Dec, 2024.
  const prevMonth = displayedMonth === 1 ? 12 : displayedMonth - 1;
  const prevYear = displayedMonth === 1 ? displayedYear - 1 : displayedYear;

  // Ensure that the next month of a date at the last month of the year, like Dec, 2025, is the
  // first month of the next year, like Jan, 2026
  const nextMonth = displayedMonth === 12 ? 1 : displayedMonth + 1;
  const nextYear = displayedMonth === 12 ? displayedYear + 1 : displayedYear;

  return (
    <div className="col-span-7 flex items-center justify-between bg-white px-4">
      <Link className="text-2xl" to={`/my-calendar/${prevYear}/${prevMonth}`}>
        ◄
      </Link>
      <h1 className="py-5 text-center text-2xl font-medium">
        {getMonthName(+month!)} {year}
      </h1>
      <Link className="text-2xl" to={`/my-calendar/${nextYear}/${nextMonth}`}>
        ►
      </Link>
    </div>
  );
}

export default CalendarHeader;
