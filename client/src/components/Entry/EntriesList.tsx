import { Link, type Location } from "react-router";
import type { EntryType } from "../../contexts/EntriesContext";
import { getDateParts } from "../../utils/date";

function EntriesList({ entriesToRender, location }: { entriesToRender: { entryNum: number; entry: EntryType }[], location: Location}) {
  return (
    <>
      {/* Make each entry show its date, entry number, and link to it*/}
      {entriesToRender.map((entryObj) => {
        const [year, month, day] = getDateParts(entryObj.entry.date);

        const entryNumber = entryObj.entryNum;
        return (
          <div data-testid="listed-entry" key={entryNumber} className="flex w-full gap-x-14 text-lg">
            <div className="flex w-1/2 justify-end">
              {/* Date of entry */}
              <p>
                {month}-{day}-{year}
              </p>
            </div>
            <div className="flex w-1/2 justify-start text-orange-400 hover:text-orange-500">
              {/* Link to entry */}
              <Link
                to={`/entry/${year}/${month}/${day}`}
                state={{ prevPage: location.pathname }}
              >
                {/* Entry Number */}
                Entry #{entryNumber}
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default EntriesList;
