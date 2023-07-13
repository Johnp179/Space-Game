import { deleteRequest } from "@/lib/apiRequests";
import { motion } from "framer-motion";
import { useErrorBoundary } from "react-error-boundary";
import ModalBackground from "./ModalBackground";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { modalVariants } from "./PostForm";

export default function DeleteModal({
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
