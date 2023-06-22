import Nav from "@/components/Nav";
import { connectDB } from "@/database/dbConnect";
import CommentModel, { IComment } from "@/database/models/Comment";
import { InferGetServerSidePropsType } from "next";
import { MouseEvent, useRef, useState, ReactElement, useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { IUser, sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CirclesWithBar } from "react-loader-spinner";
import {
  CheckIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  getRequest,
  postRequest,
  deleteRequest,
  updateRequest,
} from "@/lib/apiRequests";

function Comment({
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

const modalVariants: Variants = {
  initial: { y: -200, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    y: 200,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const modalBackgroundVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 0.8,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function ModalBackground({ children }: { children: ReactElement }) {
  return (
    <motion.div
      className={`fixed inset-0 flex h-screen justify-center items-center `}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="bg-black absolute inset-0 w-full h-full z-0"
        variants={modalBackgroundVariants}
      />
      {children}
    </motion.div>
  );
}

function Loading() {
  return (
    <motion.div
      className="fixed inset-0 flex h-screen justify-center items-center bg-black bg-opacity-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CirclesWithBar
        height="150"
        width="150"
        color="#e2e8f0"
        wrapperStyle={{}}
        wrapperClass="z-10"
        outerCircleColor=""
        innerCircleColor=""
        barColor=""
        ariaLabel="circles-with-bar-loading"
      />
    </motion.div>
  );
}

function UnauthorizedModal({ closeModal }: { closeModal: () => void }) {
  return (
    <ModalBackground>
      <motion.div
        variants={modalVariants}
        className=" bg-neutral-400 rounded-md z-10 text-xl"
      >
        <header className="flex p-2 bg-cyan-800 uppercase rounded-t-md ">
          <div className="flex-1 flex justify-center items-center font-semibold uppercase">
            unauthorized
          </div>
          <XMarkIcon
            className="w-7 h-7 cursor-pointer"
            onClick={() => closeModal()}
          />
        </header>
        <div className="p-5 h-36 flex justify-center items-center font-semibold uppercase  ">
          You must be logged in to perform that operation
        </div>
      </motion.div>
    </ModalBackground>
  );
}

function PostForm({
  closeModal,
  submit,
  method,
}: {
  closeModal: () => void;
  submit: (content: string | undefined) => Promise<void>;
  method: "update" | "post";
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <motion.form variants={modalVariants} className="w-96 h-96 z-10 text-2xl">
      <header className="flex p-2 bg-cyan-800 uppercase rounded-t-md">
        <div className="flex-1 flex justify-center items-center font-semibold uppercase">
          {method}
        </div>
        <XMarkIcon
          className="w-7 h-7 cursor-pointer"
          onClick={() => closeModal()}
        />
      </header>
      <textarea
        className="w-full p-3 text-slate-700 resize-none outline-none bg-neutral-200 "
        rows={4}
        ref={textareaRef}
        placeholder="Enter your text here..."
      />
      <footer className="p-2 bg-cyan-800 rounded-b-md flex justify-end relative bottom-2">
        <CheckIcon
          className="h-8 w-8 border rounded-md hover:bg-white hover:text-black"
          onClick={() => submit(textareaRef.current?.value)}
        />
      </footer>
    </motion.form>
  );
}

function DeleteModal({
  idToAlter,
  setLoading,
  closeModal,
  getComments,
}: {
  idToAlter: string;
  setLoading: (arg: boolean) => void;
  closeModal: () => void;
  getComments: () => Promise<void>;
}) {
  const { showBoundary } = useErrorBoundary();

  async function submit() {
    setLoading(true);
    closeModal();
    try {
      await deleteRequest(`api/comments/${idToAlter}`);
      getComments();
    } catch (error) {
      showBoundary(error);
    }
  }
  return (
    <ModalBackground>
      <motion.form
        variants={modalVariants}
        className=" bg-neutral-400 rounded-md z-10 text-2xl"
      >
        <header className="flex p-2 bg-cyan-800 uppercase rounded-t-md">
          <div className="flex-1 flex justify-center items-center font-semibold uppercase">
            delete
          </div>
          <XMarkIcon
            className="w-7 h-7 cursor-pointer "
            onClick={() => closeModal()}
          />
        </header>
        <div className="p-5 h-36 flex justify-center items-center gap-3 font-semibold uppercase">
          <div>Are you sure you wish to delete this comment?</div>
          <div className="flex gap-2">
            <CheckIcon
              className="w-7 h-7 border rounded-md hover:bg-black hover:border-black cursor-pointer"
              onClick={submit}
            />
          </div>
        </div>
      </motion.form>
    </ModalBackground>
  );
}

function UpdateModal({
  idToAlter,
  closeModal,
  setLoading,
  getComments,
}: {
  idToAlter: string;
  setLoading: (arg: boolean) => void;
  closeModal: () => void;
  getComments: () => Promise<void>;
}) {
  const { showBoundary } = useErrorBoundary();

  async function submit(content: string | undefined) {
    closeModal();
    setLoading(true);
    try {
      await updateRequest(`api/comments/${idToAlter}`, {
        content,
      });
      getComments();
    } catch (error) {
      console.error(error);
      showBoundary(error);
    }
  }

  return (
    <ModalBackground>
      <PostForm submit={submit} method="update" closeModal={closeModal} />
    </ModalBackground>
  );
}

function PostModal({
  setLoading,
  closeModal,
  getComments,
  user,
}: {
  setLoading: (arg: boolean) => void;
  closeModal: () => void;
  getComments: () => Promise<void>;
  user: IUser | null;
}) {
  const { showBoundary } = useErrorBoundary();

  async function submit(content: string | undefined) {
    closeModal();
    setLoading(true);
    try {
      await postRequest("api/comments", {
        author: user!.username,
        content,
      });
      getComments();
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <ModalBackground>
      <PostForm method="post" closeModal={closeModal} submit={submit} />
    </ModalBackground>
  );
}

export default function Comments({
  comments: commentsProp,
  user: userProp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { showBoundary } = useErrorBoundary();
  const [user, setUser] = useState(userProp);
  const [comments, setComments] = useState(commentsProp);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    unauthorized: false,
    post: false,
    update: false,
    delete: false,
  });
  const [idToAlter, setIdToAlter] = useState("");

  function closeModal(method: "delete" | "update" | "post" | "unauthorized") {
    setShowModal({
      ...showModal,
      [method]: false,
    });
  }

  function openModal(method: "delete" | "update", _id: string) {
    setShowModal({
      ...showModal,
      [method]: true,
    });

    setIdToAlter(_id);
  }

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
    try {
      const comments = await getRequest("api/comments");
      setLoading(false);
      setComments(comments);
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <main className="flex flex-col items-center min-h-screen pt-24 pb-48">
        <>
          <div className="space-y-5 ">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                user={user}
                {...comment}
                openModal={openModal}
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
          {loading && <Loading />}
          <AnimatePresence>
            {showModal.unauthorized && (
              <UnauthorizedModal
                closeModal={() => closeModal("unauthorized")}
              />
            )}
            {showModal.post && (
              <PostModal
                closeModal={() => closeModal("post")}
                getComments={getComments}
                user={user}
                setLoading={setLoading}
              />
            )}
            {showModal.update && (
              <UpdateModal
                idToAlter={idToAlter}
                closeModal={() => closeModal("update")}
                getComments={getComments}
                setLoading={setLoading}
              />
            )}
            {showModal.delete && (
              <DeleteModal
                idToAlter={idToAlter}
                closeModal={() => closeModal("delete")}
                getComments={getComments}
                setLoading={setLoading}
              />
            )}
          </AnimatePresence>
        </>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  connectDB();
  const results = await CommentModel.find({});
  const comments: IComment[] = results.map((doc) => ({
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
