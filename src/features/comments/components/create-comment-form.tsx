import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Code as CodeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateComment } from "../api/use-create-comment";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCurrent } from "@/features/auth/api/use-current";
import { createCommentSchema } from "../schemas";
import { z } from "zod";

const CommentPreview = ({ content }: { content: string }) => {
  // Split content by code block markers
  const parts = content.split("```");

  return (
    <div className="mt-4 p-4 rounded-md bg-neutral-100 dark:bg-neutral-900">
      {parts.map((part, index) => {
        // Even indices are regular text, odd indices are code blocks
        if (index % 2 === 0) {
          return (
            <p key={index} className="whitespace-pre-wrap">
              {part}
            </p>
          );
        } else {
          return (
            <pre
              key={index}
              className="my-2 p-4 rounded bg-neutral-200 dark:bg-neutral-800 font-mono"
            >
              <code>{part}</code>
            </pre>
          );
        }
      })}
    </div>
  );
};

export const CreateCommentForm = ({ onCancel }: { onCancel?: () => void }) => {
  const taskId = useTaskId();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

    mutate(
      { formData },
      {
        onSuccess: () => {
          form.reset();
          setSelectedFile(null);
          setShowPreview(false);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          onCancel?.();
        },
      }
    );
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.getValues("comment");

    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      "\n```\n" +
      selectedText +
      "\n```\n" +
      text.substring(end);

    form.setValue("comment", newText);
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={insertCodeBlock}
                        className="flex items-center gap-2"
                      >
                        <CodeIcon className="size-4" />
                        Insert Code Block
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        placeholder="Enter your comment. Use the Code Block button to format code snippets."
                        className="dark:bg-neutral-700 font-mono min-h-32"
                        disabled={isPending}
                      />
                    </FormControl>
                    {showPreview && field.value && (
                      <CommentPreview content={field.value} />
                    )}
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
                    <Loader className="animate-spin size-4 mr-2" /> Loading
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

export default CreateCommentForm;
