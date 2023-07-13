import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Variants, motion } from "framer-motion";
import { useRef } from "react";

export const modalVariants: Variants = {
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

export default function PostForm({
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
