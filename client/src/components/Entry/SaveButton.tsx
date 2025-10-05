import { useEntries } from "../../context/EntriesContext";

function SaveButton({hasChanges}: {hasChanges: boolean}) {
  const entries = useEntries();

  return (
    <>
      <button className="bg-blue-400 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-500 hover:cursor-pointer" onClick={(event) => {
        // Save new list of entries to localStorage
        if (hasChanges) {
          localStorage.setItem("entries", JSON.stringify(entries));
        }
      }}>Save</button>
    </>
  )
}

export default SaveButton;