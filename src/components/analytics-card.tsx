import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "increase" | "decrease";
  increaseValue: number;
}

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  const iconColour =
    variant === "increase" ? "text-emerald-500" : "text-red-500";
  const increaseValueColour =
    variant === "increase" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "increase" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColour)} />
            <span
              className={cn(
                "truncate text-base font-medium",
                increaseValueColour
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
