import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetComments = ({ taskId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const response = await client.api.comments.$get({
        query: { taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const { data } = await response.json();

      return { documents: data };
    },
  });
  return query;
};
