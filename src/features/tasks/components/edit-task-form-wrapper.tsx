import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { EditTaskForm } from "../components/edit-task-form";
import { useProjectId } from "../hooks/use-project-id";
import { useGetTask } from "../api/use-get-task";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  $id: string;
}

export const EditTaskFormWrapper = ({
  onCancel,
  $id,
}: EditTaskFormWrapperProps) => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingInitialValues } = useGetTask(
    {
      taskId: $id,
    }
  );

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const memberOptions = members?.documents.map((project) => ({
    $id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingInitialValues || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      projectId={projectId}
      memberOptions={memberOptions || []}
      initialValues={initialValues}
    />
  );
};
