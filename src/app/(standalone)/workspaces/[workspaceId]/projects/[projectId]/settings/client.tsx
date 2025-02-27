"use client";

import { useProjectId } from "@/features/tasks/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;

  if (!initialValues) return <PageError message="Failed to fetch project" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
