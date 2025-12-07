import { Link, useParams } from "react-router";
import { getMonthName } from "../../utils/date";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

function CalendarHeader() {
  const { year, month } = useParams(); // The month here is not 0-indexed.
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
      <Link data-testid="prev-month-link" to={`/my-calendar/${prevYear}/${prevMonth}`}>
        <ArrowBigLeft className="fill-rose-200 stroke-yellow-900 w-6 md:w-8 h-auto" />
      </Link>

      <h1 className="py-5 text-center text-xl md:text-2xl font-medium font-heading">
        {getMonthName(+month!)} {year}
      </h1>

      <Link data-testid="next-month-link" to={`/my-calendar/${nextYear}/${nextMonth}`}>
        <ArrowBigRight className="fill-rose-200 stroke-yellow-900 w-6 md:w-8 h-auto" />
      </Link>
    </div>
  );
}

export default CalendarHeader;
