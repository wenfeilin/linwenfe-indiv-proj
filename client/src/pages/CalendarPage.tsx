import Calendar from "../components/Calendar/Calendar";
import ExportPlaylistComponent from "../components/Music/ExportPlaylistComponent";

function CalendarPage({checkLoginStatus, setIsLoggedIn, isLoggedIn, isCalendarLoading, setIsCalendarLoading}: {checkLoginStatus: any, setIsLoggedIn: (isLoggedIn: boolean) => void, isLoggedIn: boolean, isCalendarLoading: boolean, setIsCalendarLoading: (isCalendarLoading: boolean) => void}) {
  // const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div className="flex flex-col items-center h-full px-3 py-4 
      md:grid md:grid-cols-[1fr_5fr_1fr] md:px-0 md:items-start md:py-6 xl:py-8">
      { !isCalendarLoading && (
          <ExportPlaylistComponent 
            containerStyles="order-1 text-center 
            md:w-full md:col-start-3 md:flex md:justify-center" 
            checkLoginStatus={checkLoginStatus} 
            setIsLoggedIn={setIsLoggedIn} 
            isLoggedIn={isLoggedIn} />
        ) 
      }
      <div className="w-full md:col-start-2">
        <Calendar setIsCalendarLoading={setIsCalendarLoading} containerStyles="mb-4 md:mb-0"></Calendar>
      </div>
    </div>
  );
}

export default CalendarPage;
