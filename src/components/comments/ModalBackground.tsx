import { Variants, motion } from "framer-motion";
import { ReactElement } from "react";

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

export default function ModalBackground({
  children,
}: {
  children: ReactElement;
}) {
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
