import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("size-10 relative rounded-md overflow-hidden", fallbackClassName)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", fallbackClassName)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
