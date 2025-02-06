"use client";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useProjectId } from "@/features/tasks/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";

import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";

export const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isAnalyticsLoading;

  if (isLoading) return <PageLoader />;

  if (!project) return <PageError message="Failed to fetch project" />;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            fallbackClassName="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4" /> Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analyticsData ? <Analytics data={analyticsData} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
