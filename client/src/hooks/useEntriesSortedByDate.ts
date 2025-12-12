import { useEntries } from "../contexts/EntriesContext";
import { getDateParts } from "../utils/date";

// Sorts entries from least to most recent
function useEntriesSortedByDate() {
  const entries = useEntries();
  const entriesSortedByDate = [...entries];

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

    // Will never return 0 though because there can't be two of the same dates.
    return 0;
  });

  return entriesSortedByDate;
}

export default useEntriesSortedByDate;