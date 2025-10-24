import { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ExportPlaylistComponent from "../components/Music/ExportPlaylistComponent";

function CalendarPage() {
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      { isCalendarLoading && <ExportPlaylistComponent></ExportPlaylistComponent> }
      <Calendar setIsCalendarLoading={setIsCalendarLoading}></Calendar>
    </div>
  );
}

export default CalendarPage;
