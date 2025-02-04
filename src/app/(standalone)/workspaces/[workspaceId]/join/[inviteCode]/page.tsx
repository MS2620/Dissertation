import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspacesJoinInviteCodePage = async ({
  params,
}: WorkspaceIdJoinPageProps) => {
  const { workspaceId } = await params;
  const user = await getCurrent();
  if (!user) redirect("/login");

  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!workspace) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={{ name: workspace.name }} />
    </div>
  );
};

export default WorkspacesJoinInviteCodePage;
