import type { MouseEventHandler } from "react";

function EditButton({
  onEdit,
}: {
  onEdit: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <>
      <button
        className="rounded-md bg-blue-400 px-6.75 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-500"
        onClick={onEdit}
      >
        Edit
      </button>
    </>
  );
}

export default EditButton;
