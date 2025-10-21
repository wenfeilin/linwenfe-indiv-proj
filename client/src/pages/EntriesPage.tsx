import { Link, useLocation } from "react-router";
import { useEntries } from "../contexts/EntriesContext";
import { useState } from "react";
import { getDateParts } from "../utils/date";

function EntriesPage() {
  // Sort entries by date.
  const entries = useEntries();
  const entriesSortedByDate = [...entries];

  // OMG THIS FUCKING SORT FXN IS WRONG!!!!!

  entriesSortedByDate.sort((a, b) => {
    const [yearA, monthA, dayA] = getDateParts(a.date);
    const [yearB, monthB, dayB] = getDateParts(b.date);

    if (yearA < yearB) {
      return -1;
    } else if (yearA > yearB) {
      return 1;
    }

    if (monthA < monthB) {
      return -1;
    } else if (monthA > monthB) {
      return 1;
    }

    if (dayA < dayB) {
      return -1;
    } else if (dayA > dayB) {
      return 1;
    }

    // Will never return 0 though because there can't be two of the same dates
    return 0;
  });

  const entriesSortedAndNumbered = entriesSortedByDate.map((entry, i) => ({
    entryNum: i + 1,
    entry: entry,
  }));

  // Info to go back to this page after clicking on entry.
  const location = useLocation();

  const numEntries = entriesSortedAndNumbered.length;
  const entriesPerPg = 12;
  let hasMoreThanOnePg = false;

  if (numEntries > entriesPerPg) {
    hasMoreThanOnePg = true;
  }
  const [page, setPage] = useState(0); // 0-indexed pages
  const start = page * entriesPerPg;
  const end =
    start + entriesPerPg > numEntries ? numEntries : start + entriesPerPg;
  const lastPage = Math.ceil(numEntries / entriesPerPg) - 1; // 0-indexed
  const isOnFirstPage = page == 0;
  const isOnLastPage = page === lastPage;

  const entriesToRender = entriesSortedAndNumbered.slice(start, end);

  // Determines entries to be rendered for previous page
  function handlePrevPage() {
    if (page - 1 >= 0) {
      setPage(page - 1);
    }
  }

  // Determines entries to be rendered for next page
  function handleNextPage() {
    if (page + 1 <= lastPage) {
      setPage(page + 1);
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-6/7 w-3/4 bg-orange-100">
        <div className="h-full w-1/2 border-r-6 border-orange-200"></div>

        {/* Right Page */}
        <div className="h-full w-1/2 border-l-6 border-orange-200 px-16 py-5">
          <div className="flex justify-between text-3xl">
            {!isOnFirstPage && (
              <button className="flex hover:text-orange-900 hover:cursor-pointer p-0.5" onClick={handlePrevPage}>
                &larr;
              </button>
            )}
            {hasMoreThanOnePg && !isOnLastPage && (
              <div className={`${isOnFirstPage && "w-full flex justify-end"}`}>
                <button className="flex hover:text-orange-900 hover:cursor-pointer p-0.5" onClick={handleNextPage}>
                  &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-8 flex items-center justify-center">
            <h1 className="text-2xl">My Entries</h1>
          </div>

          {/* Entries */}
          <div className="flex flex-col items-center gap-y-2">
            {numEntries == 0 && <p>You don't have any entries right now.</p>}
            {entriesToRender.map((entryObj) => {
              const [year, month, day] = getDateParts(entryObj.entry.date);

              const entryNumber = entryObj.entryNum;
              return (
                <div key={entryNumber} className="flex w-full gap-x-14 text-lg">
                  <div className="flex w-1/2 justify-end">
                    <p>
                      {month}-{day}-{year}
                    </p>
                  </div>
                  <div className="flex w-1/2 justify-start text-orange-400 hover:text-orange-500">
                    <Link
                      to={`/entry/${year}/${month}/${day}`}
                      state={{ prevPage: location.pathname }}
                    >
                      Entry #{entryNumber}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default EntriesPage;
