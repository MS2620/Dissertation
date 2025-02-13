"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetComments } from "@/features/comments/api/use-get-comments";
import CommentsOverview from "@/features/comments/components/comments-overview";
import { useCreateCommentModal } from "@/features/comments/hooks/use-create-comment-modal";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { PlusIcon } from "lucide-react";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });
  const { data: comments } = useGetComments({ taskId });
  const { open } = useCreateCommentModal();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  console.log(comments);

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <Separator className="my-6 dark:bg-neutral-800" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
      <Separator className="my-6 dark:bg-neutral-800" />
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold py-2">Comments</h2>
        <Button onClick={open} className="w-20">
          <PlusIcon className="size-4 text-neutral-400" />
        </Button>
      </div>
      <Separator className="my-6 dark:bg-neutral-800" />
      {comments ? (
        <CommentsOverview comments={comments.documents} />
      ) : (
        <div className="text-neutral-400 text-center">No comments yet.</div>
      )}
    </div>
  );
};
