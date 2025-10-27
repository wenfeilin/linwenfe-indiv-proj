import { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ExportPlaylistComponent from "../components/Music/ExportPlaylistComponent";

function CalendarPage() {
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-full px-3 py-4 
      md:px-10 md:pt-4 md:pb-10 
      lg:grid lg:grid-cols-[1fr_5fr_1fr] lg:px-0 lg:items-start lg:py-6 xl:py-8">
      { isCalendarLoading && (
          <ExportPlaylistComponent containerStyles="order-last lg:w-full text-center lg:col-start-3 lg:flex lg:justify-center" />
        ) 
      }
      <div className="w-full md:flex lg:col-start-2 lg:h-full ">
        <Calendar setIsCalendarLoading={setIsCalendarLoading} containerStyles="mb-4 lg:mb-0"></Calendar>
      </div>
    </div>
  );
}

export default CalendarPage;
