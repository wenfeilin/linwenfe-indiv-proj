import { useParams, Link, Navigate } from "react-router";
import Calendar from "../components/Calendar/Calendar";

function CalendarPage() {
  return (
    // Figure out how to make calendar center vertically on the page
    <div className="flex flex-col items-center justify-center h-full">
      <Calendar></Calendar>
    </div>
  );
}

export default CalendarPage;
