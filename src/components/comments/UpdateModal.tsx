import { updateRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";
import ModalBackground from "./ModalBackground";
import PostForm from "./PostForm";

export default function UpdateModal({
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
