import { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ExportPlaylistComponent from "../components/Music/ExportPlaylistComponent";

function CalendarPage() {
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-full px-3 py-4 md:px-10 md:pt-4 md:pb-10 lg:px-36 lg:pb-18">
      { isCalendarLoading && (
          <ExportPlaylistComponent containerStyles="order-1 md:order-0 md:mb-4 md:w-full text-right" />
        ) 
      }
      <Calendar setIsCalendarLoading={setIsCalendarLoading} containerStyles="mb-4 md:mb-0"></Calendar>
    </div>
  );
}

export default CalendarPage;
