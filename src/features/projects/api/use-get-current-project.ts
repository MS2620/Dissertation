import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetCurrentProjectProps {
  projectId: string;
  workspaceId: string;
}

export const useGetCurrentProjects = ({
  projectId,
  workspaceId,
}: UseGetCurrentProjectProps) => {
  const query = useQuery({
    queryKey: ["projects", projectId, workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId, projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
