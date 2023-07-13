import { motion } from "framer-motion";
import ModalBackground from "./ModalBackground";
import { modalVariants } from "./PostForm";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function UnauthorizedModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
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
