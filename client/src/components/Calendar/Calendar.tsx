import { useParams } from "react-router";
import CalendarBlock from "./CalendarBlock";
import { generateCalendarDates } from "../../utils/calendar";

function Calendar() {
  // Retrieve the year and month of the calendar (from the URL) the user navigated to.
  // The month here is not 0-indexed.
  let { year, month } = useParams();

  // Convert the URL parameters to numbers.
  const selectedYr = Number(year);
  const selectedMonth = Number(month);

  const calendarDates = generateCalendarDates(selectedYr, selectedMonth);

  return (
    <div>
      {/* Calendar Header */}
      <h1 className="mb-12 text-center text-2xl font-bold">
        Calendar Header of {month}, {year}
      </h1>
      {/* Calendar Blocks Section */}
      <div className="grid grid-cols-7">
        {calendarDates.map((date, i) => (
          <CalendarBlock key={i} date={date}></CalendarBlock>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
