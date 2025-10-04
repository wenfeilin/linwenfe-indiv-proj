import { useContext } from 'react';
import Entry from "../components/Entry/Entry";

function EntryPage() {
  return(
    <>
      {/* entry navigation btns */}
      {/* get the date from the routing params, based on what the user clicked on */}
      <h1>Date: </h1> 
      <Entry>
      </Entry>
      {/* Spotify Player */}
      {/* Song Notes */}
    </>
  );
}

export default EntryPage;