import { useState, useContext } from 'react';
import { useEntries } from '../../context/EntriesContext';
import type { SongSelection } from './SongSelection';

// interface Props {
//   id: number;
//   date: string;
//   entryContent: string;
//   entrySong: SongSelection | null;
//   songNotes: string;
// }

function Entry(/*{ id, date, entryContent, entrySong }: Props*/) {
  // const [journalContent, setJournalContent] = useState(entryContent);
  const entries = useEntries();

  

  return(
    <>
    </>
  );
}

export default Entry;