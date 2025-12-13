import { useLocation } from "react-router";
import { useState } from "react";
import EntriesList from "../components/Entry/EntriesList";
import useEntriesSortedByDate from "../hooks/useEntriesSortedByDate";

function EntriesPage() {
  // Sort entries by date.
  const entriesSortedByDate = useEntriesSortedByDate();

  const entriesSortedAndNumbered = entriesSortedByDate.map((entry, i) => ({
    entryNum: i + 1,
    entry: entry,
  }));

  // Info to go back to this page after clicking on entry.
  const location = useLocation();

  const numEntries = entriesSortedAndNumbered.length;
  const entriesPerPg = 10;

  const [page, setPage] = useState(0); // 0-indexed pages
  const start = page * entriesPerPg;
  const end = start + entriesPerPg > numEntries ? numEntries : start + entriesPerPg;
  const lastPage = numEntries === 0? 0 : Math.ceil(numEntries / entriesPerPg) - 1; // 0-indexed
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
    <div className="flex h-full items-center justify-center py-8">
      <div className="flex h-full w-3/4 bg-orange-100">
      
        {/* Left Page */}
        <div className="hidden lg:block lg:h-full lg:w-1/2 lg:border-r-6 lg:border-orange-200">
        </div>

        {/* Right Page */}
        <div className="border-l-12 lg:h-full lg:w-1/2 lg:border-l-6 border-orange-200 px-16 py-6 w-full">
          <div className="flex justify-between items-center text-3xl w-full mb-6">
            {/* Prev Pg Button */}
            <button className={`flex hover:text-orange-900 hover:cursor-pointer p-0.5 ${isOnFirstPage && "invisible"}`} onClick={handlePrevPage}>
              &larr;
            </button>
            
            {/* Title */}
            <h1 className="text-xl md:text-2xl">My Entries</h1>
            
            {/* Next Pg Button */}
            <button className={`flex hover:text-orange-900 hover:cursor-pointer p-0.5 ${isOnLastPage && "invisible"}`} onClick={handleNextPage}>
              &rarr;
            </button>
            
          </div>


          {/* Entries */}
          <div className="flex flex-col items-center gap-y-2">
            {numEntries == 0 && <p>You don't have any entries right now.</p>}
            <EntriesList entriesToRender={entriesToRender} location={location} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default EntriesPage;
