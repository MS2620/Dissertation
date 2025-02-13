import { MoreHorizontal } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";

interface KanbanCardProps {
  task: Task;
}

interface Assignee {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  email: string;
  name: string;
  role: string;
  userId: string;
  workspaceId: string;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const assignees: Assignee[] = task.assignee || [];

  return (
    <div className="p-2.5 mb-1.5 bg-white rounded shadow-sm space-y-3 dark:bg-neutral-600">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions $id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 dark:text-neutral-400 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <Separator className="dark:bg-neutral-700" />
      <div className="flex items-center">
        <MemberAvatar
          names={assignees.map((assignee) => assignee.name)} // Passing an array of names
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300 ml-2" />
        <div className="ml-16">
          <TaskDate value={task.dueDate} className="text-xs" />
        </div>
      </div>
    </div>
  );
};
