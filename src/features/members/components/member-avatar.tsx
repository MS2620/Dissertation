import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  names: string | string[]; // Now expects an array of names
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  names,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  const name = Array.isArray(names) ? names : [names];

  return (
    <div className="flex flex-col lg:flex-row gap-x-2">
      {name.map((name, index) => (
        <Avatar
          key={index}
          className={cn(
            "size-5 transition border border-neutral-300 dark:border-none rounded-full",
            className
          )}
        >
          <AvatarFallback
            className={cn(
              "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
              fallbackClassName
            )}
          >
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};
