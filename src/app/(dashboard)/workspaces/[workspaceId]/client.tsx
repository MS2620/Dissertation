"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { Member, MemberRole } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { Separator } from "@/components/ui/separator";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useCurrent } from "@/features/auth/api/use-current";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({
      workspaceId,
    });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const { data: user } = useCurrent();

  const isAdmin =
    members?.documents.some(
      (member) =>
        member.role === MemberRole.ADMIN && user?.$id === member.userId
    ) || false;

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects) {
    return <PageError message="Failed to load workspace data." />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList
          isAdmin={isAdmin}
          data={projects.documents}
          total={projects.total}
        />
        {members && (
          <MembersList
            isAdmin={isAdmin}
            data={members.documents}
            total={members.total}
          />
        )}
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();

  const { open: createTask } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button onClick={() => createTask()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <Separator className="my-4 dark:bg-neutral-700" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition dark:bg-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex flex-row items-center">
                      <p className="text-lg font-medium truncate">
                        {task.name}
                      </p>
                      <div className="ml-2 py-1">
                        <Badge variant={task.status}>
                          {snakeCaseToTitleCase(task.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                      <p className="text-[14px]">
                        Project: {task.project?.name}
                      </p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <p className="text-[12px] text-muted-foreground pt-[2px]">
                        Assignee: {task.assignee.name}
                      </p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate text-[12px] text-muted-foreground pt-[2px]">
                          {new Date(task.dueDate) < new Date()
                            ? `Due ${formatDistanceToNow(
                                new Date(task.dueDate)
                              )} ago`
                            : `Due in ${formatDistanceToNow(
                                new Date(task.dueDate)
                              )}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found.
          </li>
        </ul>
        <Button className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
  isAdmin: boolean;
}

export const ProjectList = ({ data, total, isAdmin }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();

  const { open: createProject } = useCreateProjectModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4 dark:bg-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          {isAdmin && (
            <Button onClick={() => createProject()}>
              <PlusIcon className="size-4 text-neutral-400" />
            </Button>
          )}
        </div>
        <Separator className="my-4 dark:bg-neutral-700" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition dark:bg-neutral-700">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      fallbackClassName="size-12 text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found.
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
  isAdmin: boolean;
}

export const MembersList = ({ data, total, isAdmin }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4 dark:bg-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden dark:bg-neutral-700">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found.
          </li>
        </ul>
      </div>
    </div>
  );
};
