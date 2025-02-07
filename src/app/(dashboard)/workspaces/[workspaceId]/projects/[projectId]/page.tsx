import { getCurrent } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { ProjectIdClient } from "./client";

const ProjectIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIdClient userId={user.$id} />;
};

export default ProjectIdPage;
