import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import React from "react";
import { Member } from "@/features/members/types";

interface EventCardProps {
  title: string;
  assignee: Member[];
  status: TaskStatus;
  $id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

export const EventCard = ({ title, assignee, status, $id }: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${$id}`);
  };

  console.log("EventCard", title, assignee, status, $id);

  // Extract assignee names to pass as a string array
  const assigneeNames = assignee.map((a) => a.name);

  return (
    <div className="px-2">
      <div
        className={cn(
          "p-1.5 text-xs bg-white dark:bg-neutral-700 text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
        onClick={onClick}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          {/* Pass assignee names as an array of strings */}
          <MemberAvatar names={assigneeNames} />
          <div className="size-1 rounded-full bg-neutral-300" />
          {/* Display the list of assignee names */}
          <p>{assigneeNames.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};
