import Entry from "../components/Entry/Entry";
import { Link, useLocation, useParams } from 'react-router-dom';
import { getMonthName } from '../utils/calendar';

function EntryPage() {

  // Get the path the user came from.
  const location = useLocation();
  const prevPagePath = location.state.prevPage;

  return(
    <div className="flex flex-col h-full pt-3">
      {/* Depending on the prevPage pathname, conditionally render Back to Calendar or Back to 
      Entries? */}
      <Link to={prevPagePath} className="ml-7 hover:text-[#E36414]"><span className="text-3xl">&larr;</span>Back</Link>
      {/* entry navigation btns */}

      {/* Get the date from the routing params, based on what the user clicked on */}
      <div className="flex flex-col flex-1 items-center ">
        <Entry></Entry>
      </div>

      {/* Spotify Player */}
      {/* Song Notes */}
    </div>
  );
}

export default EntryPage;