import Entry from "../components/Entry/Entry";
import { Link, useLocation } from "react-router-dom";

function EntryPage() {
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
          className={`ml-7 inline-block hover:text-[#E36414] ${!prevPagePath && "invisible"}`}
        >
          <span className="text-3xl">&larr;</span>Back to {prevPageLocation}
        </Link>
      </div>

      {/* entry navigation btns */}

      {/* Get the date from the routing params, based on what the user clicked on */}
      <div className="flex flex-1 flex-col items-center">
        <Entry></Entry>
      </div>
    </div>
  );
}

export default EntryPage;
