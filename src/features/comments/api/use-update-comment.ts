import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.comments)[":commentId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.comments)[":commentId"]["$patch"]
>;

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.comments[":commentId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Comment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });
  return mutation;
};
