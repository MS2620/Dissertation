"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { createTaskSchema } from "../schemas";
import { useCreateTask } from "../api/use-create-task";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskStatus } from "../types";

import { DatePicker } from "@/components/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "../hooks/use-project-id";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { value: string; label: string }[];
  memberOptions: { $id: string; name: string }[];
  hideProjectFilter?: boolean;
}

export const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  hideProjectFilter,
}: CreateTaskFormProps) => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
      projectId: hideProjectFilter ? projectId : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator className="dark:bg-neutral-700" />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a task name for your project"
                        className="dark:bg-neutral-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="dark:bg-neutral-700">
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent className="dark:bg-neutral-700">
                        {memberOptions.map((member) => (
                          <SelectItem key={member.$id} value={member.$id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="dark:bg-neutral-700">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent className="dark:bg-neutral-700">
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>To-Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In-Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In-Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          Complete
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {!hideProjectFilter && (
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="dark:bg-neutral-700">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="dark:bg-neutral-700">
                          {projectOptions.map((project) => (
                            <SelectItem
                              key={project.value}
                              value={project.value}
                            >
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar
                                  fallbackClassName="size-6"
                                  name={project.label}
                                />
                                {project.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Separator className="my-7 dark:bg-neutral-700" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
                className={cn([
                  !onCancel && "invisible",
                  "dark:hover:bg-neutral-900",
                ])}
              >
                Cancel
              </Button>
              <Button size="lg">
                {isPending ? (
                  <>
                    <Loader className="animate-spin size-10" /> Loading
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
