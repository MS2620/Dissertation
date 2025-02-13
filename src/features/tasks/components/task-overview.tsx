import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { PencilIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  // Ensure all assignees are of type Assignee
  const assigneesWithFullData = task.assignees.map((assignee) => ({
    ...assignee,
    role: assignee.role || "default_role", // Default value if missing
    userId: assignee.userId || "", // Default value if missing
    workspaceId: assignee.workspaceId || "", // Default value if missing
  }));

  return (
    <div className="flex flex-col gap-y-4 col-span-1 dark:bg-neutral-800 rounded-lg">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            onClick={() => open(task.$id)}
            size="sm"
            variant="outline"
            className="dark:hover:bg-neutral-900"
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <Separator className="my-4 dark:bg-neutral-700" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <div className="flex flex-wrap items-center gap-2">
              {assigneesWithFullData.map(
                ({ $id, name }: { $id: string; name: string }) => (
                  <div key={$id} className="flex items-center gap-2">
                    <MemberAvatar names={name} className="size-6" />
                    <p className="text-sm font-medium">{name}</p>
                  </div>
                )
              )}
            </div>
          </OverviewProperty>

          <OverviewProperty label="DueDate">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
