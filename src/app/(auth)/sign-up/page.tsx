import { SignUpCard } from "@/features/auth/components/sign-up-card";
import React from "react";
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/actions";

const page = async () => {
  const user = await getCurrent();

  if (user) redirect("/");
  return <SignUpCard />;
};

export default page;
