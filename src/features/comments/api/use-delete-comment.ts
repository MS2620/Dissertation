import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.comments)[":commentId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.comments)[":commentId"]["$delete"]
>;

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.comments[":commentId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
  return mutation;
};
