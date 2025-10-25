import { useParams } from "react-router";
import CalendarBlock from "./CalendarBlock";
import { generateCalendarDates } from "../../utils/date";
import CalendarHeader from "./CalendarHeader";
import { RotatingLines } from "react-loader-spinner";
import { type StyleProps } from "../../utils/types";

// & to union types
function Calendar({ setIsCalendarLoading, containerStyles }: { setIsCalendarLoading: (isCalendarLoading: boolean) => void } & StyleProps) {
  // Retrieve the year and month of the calendar (from the URL) the user navigated to.
  // The month here is not 0-indexed.
  let { year, month } = useParams();
  
  // Convert the URL parameters to numbers.
  const selectedYr = Number(year);
  const selectedMonth = Number(month);
  
  // Since the year and month (the URL params) are undefined until after the first render.
  if (!selectedYr || !selectedMonth) {
    setIsCalendarLoading(false);
    return(
      <RotatingLines width={50} visible={true} />
    )
  }

  const calendarDates = generateCalendarDates(selectedYr, selectedMonth);

  const daysFullNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const daysShortNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return (
    <div data-testid="calendar" className={`grid grid-cols-7 gap-0.5 bg-gray-300 border-2 border-gray-300 w-full ${containerStyles}`}>
      <CalendarHeader></CalendarHeader>

      {/* Calendar Body Section */}
      {/* Render the days of the week */}

      {/* Use short names for smaller screens */}
      {daysShortNames.map((day, i) => (
        <p key={i} className={"bg-blue-100 py-1.5 text-center text-sm md:hidden"}>
          {day}
        </p>
      ))}

      {/* Use full names for medium to larger screens */}
      {daysFullNames.map((day, i) => (
        <p key={i} className={"bg-blue-100 py-1.5 text-center hidden md:block"}>
          {day}
        </p>
      ))}

      {/* Render the calendar blocks for each date */}
      {calendarDates.map((date, i) => (
        <CalendarBlock key={i} blockDate={date}></CalendarBlock>
      ))}
    </div>
  );
}

export default Calendar;
