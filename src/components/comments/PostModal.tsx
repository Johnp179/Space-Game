import { useErrorBoundary } from "react-error-boundary";
import { IUser } from "@/lib/session";
import { postRequest } from "@/lib/apiRequests";
import ModalBackground from "./ModalBackground";
import PostForm from "./PostForm";

export default function PostModal({
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
