import { MoveLeft } from "lucide-react";
import Entry from "../components/Entry/Entry";
import { Link, useLocation } from "react-router-dom";

function EntryPage({checkLoginStatus, setIsLoggedIn, isLoggedIn}: {checkLoginStatus: any, setIsLoggedIn: (isLoggedIn: boolean) => void, isLoggedIn: boolean}) {
  // Get the path the user came from.
  const location = useLocation();
  const prevPagePath = location.state ? location.state?.prevPage : null;
  let prevPageLocation = null;

  if (prevPagePath) {
    if (prevPagePath.includes("calendar")) {
      prevPageLocation = "Calendar";
    } else if (prevPagePath.includes("my-entries")) {
      prevPageLocation = "My Entries";
    }
  }

  return (
    <div className="flex h-full flex-col pt-3">
      {/* Depending on the prevPage pathname, conditionally render Back to Calendar or Back to 
      Entries? */}
      <div>
        <Link
          to={prevPagePath}
          className={`inline-block ml-7 mb-4 hover:text-[#E36414] ${!prevPagePath && "invisible"}`}
        >
          <div className="flex items-center gap-1">
            <MoveLeft />
            <span className="font-bold">Back to {prevPageLocation}</span>
          </div>
        </Link>
      </div>

      {/* entry navigation btns */}

      {/* Get the date from the routing params, based on what the user clicked on */}
      <div className="flex flex-1 flex-col items-center">
        <Entry checkLoginStatus={checkLoginStatus} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}></Entry>
      </div>
    </div>
  );
}

export default EntryPage;
