"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import { createCommentSchema } from "../schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "../api/use-create-comment";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Input } from "@/components/ui/input";

interface CreateCommentFormProps {
  onCancel?: () => void;
}

export const CreateCommentForm = ({ onCancel }: CreateCommentFormProps) => {
  const taskId = useTaskId();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate, isPending } = useCreateComment();

  if (!user) {
    throw new Error("User not found");
  }

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(
      createCommentSchema.omit({ taskId: true, workspaceId: true })
    ),
    defaultValues: {
      taskId,
      workspaceId,
      comment: "",
      document: null,
    },
  });

  const onSubmit = (values: z.infer<typeof createCommentSchema>) => {
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("workspaceId", workspaceId);
    formData.append("comment", values.comment);

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    // Log FormData contents for debugging
    console.log("FormData contents before submission:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    mutate(
      { formData },
      {
        onSuccess: () => {
          form.reset();
          setSelectedFile(null);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          onCancel?.();
        },
      }
    );
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type, file.size);
      setSelectedFile(file);
      form.setValue("document", file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new comment
        </CardTitle>
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
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your comment"
                        className="dark:bg-neutral-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={() => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-x-5">
                      <div className="flex flex-col">
                        <p className="text-sm">Documents</p>
                        <p className="text-sm text-muted-foreground">
                          PDF, SVG, DOCX or XLSX, max 3mb
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.svg,.docx,.xlsx"
                          ref={inputRef}
                          onChange={handleDocumentChange}
                          disabled={isPending}
                        />
                        {selectedFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
              <Button size="lg" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className="animate-spin size-10" /> Loading
                  </>
                ) : (
                  "Create Comment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
