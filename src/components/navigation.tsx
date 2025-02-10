"use client";

import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import { MemberRole } from "@/features/members/types";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCurrent } from "@/features/auth/api/use-current";

const getRoutes = (isAdmin: boolean) => [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
    adminOnly: false,
  },
  {
    label: isAdmin ? "Workspace Tasks" : "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
    adminOnly: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
    adminOnly: true,
  },
  {
    label: "Workspace Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
    adminOnly: true,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const { data: user } = useCurrent();
  const { data: members } = useGetMembers({ workspaceId });

  const isAdmin =
    members?.documents.some(
      (member) =>
        member.role === MemberRole.ADMIN && user?.$id === member.userId
    ) ?? false;

  const routes = getRoutes(isAdmin);

  const filteredRoutes = routes.filter((route) => !route.adminOnly || isAdmin);

  return (
    <ul className="flex flex-col">
      {filteredRoutes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 ",
                isActive &&
                  "bg-white dark:bg-neutral-700 shadow-sm hover:opacity-100 text-primary dark:text-white"
              )}
            >
              <Icon className="size-5 text-neutral-500 dark:text-neutral-400" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
