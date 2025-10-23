import Calendar from "../components/Calendar/Calendar";
import ExportPlaylistComponent from "../components/Music/ExportPlaylistComponent";

function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ExportPlaylistComponent></ExportPlaylistComponent>
      <Calendar></Calendar>
    </div>
  );
}

export default CalendarPage;
