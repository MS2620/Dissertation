import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectMembersProps {
  projectId: string;
}

export const useGetProjectMembers = ({
  projectId,
}: UseGetProjectMembersProps) => {
  const query = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["members"][
        "$get"
      ]({
        param: { projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project members");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
