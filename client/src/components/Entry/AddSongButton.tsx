function AddSongButton({ addingSong, setAddingSong }: { addingSong: boolean, setAddingSong: any }) {
  return (
    <button
      onClick={() => setAddingSong(true)}
      className="rounded-md bg-yellow-500 px-6 py-2 font-bold text-white hover:cursor-pointer 
               hover:bg-yellow-600 disabled:bg-yellow-700"
      disabled={addingSong}
    >
      Add Song
    </button>
  );
}

export default AddSongButton;
