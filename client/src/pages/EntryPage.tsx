import Entry from "../components/Entry/Entry";
import { Link, useLocation, useParams } from 'react-router-dom';
import { getMonthName } from '../utils/calendar';

function EntryPage() {
  const { year, month, day } = useParams();

  // Get the path the user came from.
  const location = useLocation();
  const prevPagePath = location.state.prevPage;

  return(
    <div className="flex flex-col h-full">
      {/* Depending on the prevPage pathname, conditionally render Back to Calendar or Back to 
      Entries? */}
      <Link to={prevPagePath}><span className="text-3xl">&larr;</span>Back</Link>
      {/* entry navigation btns */}

      {/* Get the date from the routing params, based on what the user clicked on */}
      <div className="flex flex-col flex-1">
        <h1 className="text-xl font-bold">{getMonthName(+month!)} {day}, {year} </h1>
        <Entry></Entry>
      </div>

      {/* Spotify Player */}
      {/* Song Notes */}
    </div>
  );
}

export default EntryPage;