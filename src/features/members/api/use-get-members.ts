import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetMembersProps {
  workspaceId: string;
  projectId?: string;
}

export const useGetMembers = ({
  workspaceId,
  projectId,
}: useGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId, projectId],
    queryFn: async () => {
      const query = projectId ? { workspaceId, projectId } : { workspaceId };

      const response = await client.api.members.$get({
        query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
