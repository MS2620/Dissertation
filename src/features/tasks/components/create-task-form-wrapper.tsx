import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";
import { useProjectId } from "../hooks/use-project-id";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const memberOptions = members?.documents.map((project) => ({
    $id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectId={projectId}
      memberOptions={memberOptions || []}
    />
  );
};
