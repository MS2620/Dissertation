import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { ModeToggle } from "./mode-toggle";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full dark:bg-neutral-800 flex flex-col">
      <div className="flex-grow">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={64} height={48} />
        </Link>
        <Separator className="my-4 dark:bg-neutral-700" />
        <WorkspaceSwitcher />
        <Separator className="my-4 dark:bg-neutral-700" />
        <Navigation />
        <Separator className="my-4 dark:bg-neutral-700" />
        <Projects />
      </div>
      <Separator className="my-4 dark:bg-neutral-700" />
      <div className="flex justify-center mt-auto">
        <ModeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
