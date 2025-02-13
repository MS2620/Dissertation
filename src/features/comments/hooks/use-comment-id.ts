import { useParams } from "next/navigation";

export const useCommentId = () => {
  const params = useParams();

  return params.taskId as string;
};
