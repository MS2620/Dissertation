import { CreateCommentForm } from "./create-comment-form";

interface CreateCommentFormWrapperProps {
  onCancel: () => void;
}

export const CreateCommentFormWrapper = ({
  onCancel,
}: CreateCommentFormWrapperProps) => {
  return <CreateCommentForm onCancel={onCancel} />;
};
