import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  dueDate,
  search,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId, projectId, status, dueDate, search],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId || undefined,
          status: status || undefined,
          dueDate: dueDate || undefined,
          search: search || undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch individual task");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
