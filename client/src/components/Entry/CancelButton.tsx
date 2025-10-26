function CancelButton({ onCancel }: { onCancel: () => Promise<void> }) {
  return (
    <>
      <button
        className="rounded-md bg-gray-400 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-gray-500"
        onClick={async () => {
          await onCancel();
        }}
      >
        Cancel
      </button>
    </>
  );
}

export default CancelButton;
