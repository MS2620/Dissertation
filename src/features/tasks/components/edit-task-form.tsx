"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";

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
import { useUpdateTask } from "../api/use-update-task";
import { MultiSelect } from "@/components/multi-select";

interface EditTaskFormProps {
  onCancel?: () => void;
  memberOptions: { $id: string; name: string }[];
  initialValues: Task;
}

export const EditTaskForm = ({
  onCancel,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({
        workspaceId: true,
        description: true,
        projectId: true,
      })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      assigneeId: initialValues.assigneeId ? [initialValues.assigneeId] : [],
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
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
        <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
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
                    <MultiSelect
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      options={memberOptions}
                      placeholder="Select assignee/s"
                    />
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
