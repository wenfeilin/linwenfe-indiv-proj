import { useState, type FormEvent } from "react";

function SongSearchForm() {
  const [searchContent, setSearchContent] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    
    console.log(searchContent)

    // Make request for the song.
    if (searchContent !== "") {
      try {
        const response = await fetch(
          `${apiUrl}/songs?search=${encodeURIComponent(searchContent)}`,
          {credentials: "include"} // to send cookies w/ the request
        )
        const results = await response.json();
  
        setSearchResults(results);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={searchContent}
          name="song-title"
          id="song-title"
          placeholder="Search for a song"
          onChange={(event) => setSearchContent(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {searchResults && <p>{JSON.stringify(searchResults, null, 2)}</p>}
    </div>
  );
}

export default SongSearchForm;
