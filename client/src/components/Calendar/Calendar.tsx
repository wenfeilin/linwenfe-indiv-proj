import { useParams } from "react-router";
import CalendarBlock from "./CalendarBlock";
import { generateCalendarDates, getMonthName } from "../../utils/calendar";
import CalendarHeader from "./CalendarHeader";

function Calendar() {
  // Retrieve the year and month of the calendar (from the URL) the user navigated to.
  // The month here is not 0-indexed.
  let { year, month } = useParams();

  // Convert the URL parameters to numbers.
  const selectedYr = Number(year);
  const selectedMonth = Number(month);

  const calendarDates = generateCalendarDates(selectedYr, selectedMonth);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="border-2 border-gray-300">
      <div className="grid grid-cols-7 gap-0.5 bg-gray-300">
        <CalendarHeader></CalendarHeader>

      {/* Calendar Body Section */}
        {/* Render the days of the week */}
        {days.map((day, i) => (
          <p key={i} className={"px-5 py-1.5 text-center bg-blue-100"}>
            {day}
          </p>
        ))}

        {/* Render the calendar blocks for each date */}
        {calendarDates.map((date, i) => (
          <CalendarBlock key={i} blockDate={date}></CalendarBlock>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
