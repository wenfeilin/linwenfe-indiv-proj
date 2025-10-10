import { Link } from "react-router";
import { useEntries } from "../context/EntriesContext";

function EntriesPage() {
  // Sort entries by date.
  const entries = useEntries();
  const entriesSortedByDate = [...entries];
  entriesSortedByDate.sort((a, b) => a.date < b.date ? -1 : 1);

  return(
    <>
      <h1>Entries</h1>
      <h2>{entries.length == 0 ? "empty" : "not empty"}</h2>
      <h2>{entriesSortedByDate.length == 0 ? "empty" : "not empty"}</h2>
      {entriesSortedByDate.map((entry) => {
        const dateParts = entry.date.split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        <Link to={`/entry/${year}/${month}/${day}`}>{entry.date}</Link>
      })}
    </>
  );
}

export default EntriesPage;