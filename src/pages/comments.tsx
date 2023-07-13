import RegularNav from "@/components/nav/RegularNav";
import UnauthorizedModal from "@/components/comments/UnauthorizedModal";
import UpdateModal from "@/components/comments/UpdateModal";
import DeleteModal from "@/components/comments/DeleteModal";
import PostModal from "@/components/comments/PostModal";
import Comment from "@/components/comments/Comment";
import { connectDB } from "@/database/dbConnect";
import CommentModel, { IComment } from "@/database/models/Comment";
import { InferGetServerSidePropsType } from "next";
import { MouseEvent, useRef, useState, ReactElement, useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { IUser, sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CirclesWithBar } from "react-loader-spinner";
import { getRequest } from "@/lib/apiRequests";

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
      <RegularNav user={user} setUser={setUser} />
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
