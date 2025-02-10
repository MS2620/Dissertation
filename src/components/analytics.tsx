import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { Separator } from "@/components/ui/separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border dark:border-neutral-700 rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row min-h-full">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "increase" : "decrease"}
            increaseValue={data.taskDifference}
          />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "increase" : "decrease"}
            increaseValue={data.assignedTaskDifference}
          />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completeTaskCount}
            variant={data.completeTaskDifference > 0 ? "increase" : "decrease"}
            increaseValue={data.completeTaskDifference}
          />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "increase" : "decrease"}
            increaseValue={data.overdueTaskDifference}
          />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompleteTaskCount}
            variant={
              data.incompleteTaskDifference > 0 ? "increase" : "decrease"
            }
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" className="dark:before:black" />
    </ScrollArea>
  );
};
