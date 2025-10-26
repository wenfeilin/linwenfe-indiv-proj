function AddSongButton({ isAddSongBtnActive, setIsAddSongBtnActive, setIsSearching }: { isAddSongBtnActive: boolean, setIsAddSongBtnActive: any, setIsSearching: (isSearching: boolean) => void }) {
  return (
    <button
      onClick={() => {
        setIsAddSongBtnActive(true);
        // Can only click this button if searching for songs
        setIsSearching(true);
      }}
      className="rounded-md bg-yellow-500 px-6 py-2 font-bold text-white hover:cursor-pointer 
               hover:bg-yellow-600 disabled:bg-yellow-700"
      disabled={isAddSongBtnActive}
    >
      Add Song
    </button>
  );
}

export default AddSongButton;
