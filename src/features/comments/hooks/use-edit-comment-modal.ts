import { useQueryState, parseAsString } from "nuqs";

export const useEditCommentModal = () => {
  const [commentId, setCommentId] = useQueryState(
    "edit-comment",
    parseAsString
  );

  const open = ($id: string) => setCommentId($id);
  const close = () => setCommentId(null);

  return {
    commentId,
    open,
    close,
    setCommentId,
  };
};
