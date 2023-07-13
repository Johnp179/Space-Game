import { IComment } from "@/database/models/Comment";
import { IUser } from "@/lib/session";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Comment({
  _id,
  author,
  content,
  user,
  openModal,
}: IComment & {
  user: IUser | null;
  openModal: (method: "delete" | "update", id: string) => void;
  setIdToAlter: (arg: string) => void;
}) {
  return (
    <article className="bg-slate-300 text-black p-4 rounded-tl-md rounded-br-md w-64">
      <header className="text-2xl font-bold">{author}</header>
      <div>{content}</div>
      <footer className="flex justify-end gap-2">
        {user?.username === author && (
          <EditButtons openModal={openModal} _id={_id} />
        )}
      </footer>
    </article>
  );
}

function EditButtons({
  _id,
  openModal,
}: {
  _id: string;
  openModal: (method: "delete" | "update", _id: string) => void;
}) {
  return (
    <>
      <PencilSquareIcon
        onClick={() => openModal("update", _id)}
        className="w-7 h-7 border border-black p-1 rounded-md hover:bg-black hover:text-slate-300 cursor-pointer"
      />
      <TrashIcon
        onClick={() => openModal("delete", _id)}
        className="w-7 h-7 border border-black p-1 rounded-md hover:bg-black hover:text-slate-300 cursor-pointer"
      />
    </>
  );
}
