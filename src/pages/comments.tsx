import Nav from "@/components/Nav";
import dbConnect from "@/database/dbConnect";
import CommentModel from "@/database/models/Comment";
import { InferGetServerSidePropsType } from "next";
import { FormEvent, useRef, useState } from "react";
import { IUser, sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import {
  getRequest,
  postRequest,
  deleteRequest,
  updateRequest,
} from "@/lib/apiRequests";
import { forEachLeadingCommentRange } from "typescript";

interface IShowModal {
  unauthorized: boolean;
  post: boolean;
  update: boolean;
  delete: boolean;
}

interface IComment {
  _id: string;
  author: string;
  content: string;
}

function Comment({
  _id,
  author,
  content,
  user,
  showModal,
  setShowModal,
  setIdToAlter,
}: IComment & {
  user: IUser | null;
  showModal: IShowModal;
  setShowModal: (arg: IShowModal) => void;
  setIdToAlter: (arg: string) => void;
}) {
  function openModal(type: "delete" | "update") {
    if (type === "delete") {
      setShowModal({
        ...showModal,
        delete: true,
      });
    } else {
      setShowModal({
        ...showModal,
        delete: true,
      });
    }
    setIdToAlter(_id);
  }

  return (
    <article className="bg-slate-300 text-black p-4 rounded-tl-md rounded-br-md w-64">
      <header className="text-2xl font-bold">{author}</header>
      <div>{content}</div>
      <footer className="text-right space-x-3">
        {user?.username === author && <EditButtons openModal={openModal} />}
      </footer>
    </article>
  );
}

function EditButtons({
  openModal,
}: {
  openModal: (type: "delete" | "update") => void;
}) {
  return (
    <>
      <button
        className="border border-black p-1 rounded-sm hover:bg-black hover:text-slate-300"
        onClick={() => openModal("update")}
      >
        Edit
      </button>
      <button
        className="border border-black p-1 rounded-sm hover:bg-black hover:text-slate-300"
        onClick={() => openModal("delete")}
      >
        Delete
      </button>
    </>
  );
}

function UnauthorizedModal({
  showModal,
  setShowModal,
}: {
  showModal: IShowModal;
  setShowModal: (arg: IShowModal) => void;
}) {
  return (
    <div className="absolute bg-neutral-400 rounded-md left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <header className="text-right bg-cyan-800 rounded-t-md">
        <span
          className="text-3xl cursor-pointer mr-2"
          onClick={() =>
            setShowModal({
              ...showModal,
              unauthorized: false,
            })
          }
        >
          &times;
        </span>
      </header>
      <div className="p-5 h-36 flex justify-center items-center font-semibold uppercase">
        Are you sure you wish to delete this comment?
      </div>
    </div>
  );
}

function DeleteModal({
  idToAlter,
  setLoading,
  showModal,
  setShowModal,
  getComments,
  setNetworkError,
}: {
  idToAlter: string;
  setLoading: (arg: boolean) => void;
  showModal: IShowModal;
  setShowModal: (arg: IShowModal) => void;
  setNetworkError: (arg: boolean) => void;
  getComments: () => Promise<void>;
}) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal({
      ...showModal,
      post: false,
    });
    setLoading(true);
    const { error } = await deleteRequest(`api/comments/${idToAlter}`);
    if (error) {
      console.error(error);
      return setNetworkError(true);
    }
    getComments();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bg-neutral-400 rounded-md left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <header className="text-right bg-cyan-800 rounded-t-md">
        <span
          className="text-3xl cursor-pointer mr-2"
          onClick={() =>
            setShowModal({
              ...showModal,
              delete: false,
            })
          }
        >
          &times;
        </span>
      </header>
      <div className="p-5 h-36 flex justify-center items-center font-semibold uppercase">
        Are you sure you wish to delete this comment?
      </div>
    </form>
  );
}

function UpdateModal({
  idToAlter,
  setLoading,
  showModal,
  setShowModal,
  getComments,
  setNetworkError,
}: {
  idToAlter: string;
  setLoading: (arg: boolean) => void;
  showModal: IShowModal;
  setShowModal: (arg: IShowModal) => void;
  setNetworkError: (arg: boolean) => void;
  getComments: () => Promise<void>;
}) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return <form onSubmit={handleSubmit}></form>;
}

function PostModal({
  setLoading,
  showModal,
  setShowModal,
  getComments,
  setNetworkError,
  user,
}: {
  setLoading: (arg: boolean) => void;
  showModal: IShowModal;
  setShowModal: (arg: IShowModal) => void;
  setNetworkError: (arg: boolean) => void;
  getComments: () => Promise<void>;
  user: IUser | null;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal({
      ...showModal,
      post: false,
    });
    setLoading(true);
    const { data, error } = await postRequest("api/comments", {
      author: user?.username,
      content: textareaRef.current?.value,
    });
    if (error) {
      console.error(error);
      return setNetworkError(true);
    }
    getComments();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute w-72 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <header className="flex justify-between bg-cyan-800 rounded-t-md  p-2">
        <h1 className="flex justify-center items-center font-semibold text-2xl uppercase">
          New Comment
        </h1>
        <span
          className="text-4xl cursor-pointer "
          onClick={() =>
            setShowModal({
              ...showModal,
              post: false,
            })
          }
        >
          &times;
        </span>
      </header>
      <textarea
        className="w-full p-3 text-slate-700 resize-none outline-none bg-neutral-200 "
        rows={4}
        ref={textareaRef}
      >
        Enter text here...
      </textarea>
      <footer className="text-right p-2 bg-cyan-800 rounded-b-md relative bottom-2">
        <button
          className="uppercase border p-1 rounded-md hover:bg-white hover:text-black"
          type="submit"
        >
          Post
        </button>
      </footer>
    </form>
  );
}

export default function Comments({
  comments: commentsProp,
  user: userProp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState(userProp);
  const [comments, setComments] = useState<IComment[]>(commentsProp);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    unauthorized: false,
    post: false,
    update: false,
    delete: false,
  });
  const [idToAlter, setIdToAlter] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const Loading = () => (
    <h1 className="text-4xl p-3 bg-neutral-500 rounded-lg text-black absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
      Loading....
    </h1>
  );

  function postButtonClick() {
    if (!user) {
      return setShowModal({
        ...showModal,
        unauthorized: true,
      });
    }
    setShowModal({
      ...showModal,
      post: true,
    });
  }

  async function getComments() {
    const { data, error } = await getRequest("api/comments");
    if (error) return setNetworkError(true);

    setShowModal({
      ...showModal,
      post: false,
      update: false,
      delete: false,
    });
    setLoading(false);
    setComments(data);
  }

  if (networkError)
    return <div>A network error occurred, please reload the page</div>;

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <main className="flex flex-col items-center min-h-screen">
        <>
          {loading && <Loading />}
          <div className="space-y-5 mt-12">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                user={user}
                {...comment}
                showModal={showModal}
                setShowModal={setShowModal}
                setIdToAlter={setIdToAlter}
              />
            ))}
          </div>
          <button
            className=" uppercase text-xl border p-2 mt-2 rounded-md hover:text-black hover:bg-neutral-200"
            onClick={postButtonClick}
          >
            Post Comment
          </button>
          {showModal.unauthorized && (
            <UnauthorizedModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
          {showModal.post && (
            <PostModal
              showModal={showModal}
              setShowModal={setShowModal}
              getComments={getComments}
              user={user}
              setNetworkError={setNetworkError}
              setLoading={setLoading}
            />
          )}
          {showModal.update && (
            <UpdateModal
              idToAlter={idToAlter}
              showModal={showModal}
              setShowModal={setShowModal}
              getComments={getComments}
              setNetworkError={setNetworkError}
              setLoading={setLoading}
            />
          )}
          {showModal.delete && (
            <DeleteModal
              idToAlter={idToAlter}
              showModal={showModal}
              setShowModal={setShowModal}
              getComments={getComments}
              setNetworkError={setNetworkError}
              setLoading={setLoading}
            />
          )}
        </>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  dbConnect();
  const result = await CommentModel.find({}, null, { maxTimeMS: 10000 });
  const comments: IComment[] = result.map((doc) => ({
    ...doc.toObject(),
    _id: doc._id.toString(),
  }));

  const { user } = req.session;

  return {
    props: {
      comments,
      user: user ?? null,
    },
  };
}, sessionOptions);
