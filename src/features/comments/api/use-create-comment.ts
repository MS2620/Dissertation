import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.comments)["$post"],
  200
>;

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, { formData: FormData }>({
    mutationFn: async ({ formData }) => {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create comment");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("✅ Comment created successfully");
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
    onError: (error) => {
      console.error("❌ Error in useCreateComment:", error);
      toast.error(error.message || "Failed to create comment");
    },
  });

  return mutation;
};
