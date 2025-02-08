import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetNonProjectMembersProps {
  workspaceId: string;
  projectId: string;
}

export const useGetNonProjectMembers = ({
  workspaceId,
  projectId,
}: useGetNonProjectMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId, projectId],
    queryFn: async () => {
      const query = { workspaceId, projectId };

      const response = await client.api.members["get-members"]["$get"]({
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
