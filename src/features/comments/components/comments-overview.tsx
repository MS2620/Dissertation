import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CommentsResponse } from "../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import DocumentAttachment from "./document-attachment";
import { formatDistanceToNow } from "date-fns";
import { Loader, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateComment } from "../api/use-update-comment";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteComment } from "../api/use-delete-comment";

interface CommentsOverviewProps {
  comments: CommentsResponse;
}

const CommentContent = ({ content }: { content: string }) => {
  // Split content by code block markers
  const parts = content.split("```");

  return (
    <>
      {parts.map((part, index) => {
        // Even indices are regular text, odd indices are code blocks
        if (index % 2 === 0) {
          return (
            <p
              key={index}
              className="whitespace-pre-wrap text-muted-foreground dark:text-white"
            >
              {part}
            </p>
          );
        } else {
          return (
            <pre
              key={index}
              className="my-2 p-4 rounded bg-neutral-800 dark:bg-neutral-900 font-mono text-sm overflow-x-auto"
            >
              <code className="text-white">{part}</code>
            </pre>
          );
        }
      })}
    </>
  );
};

const CommentsOverview = ({ comments }: CommentsOverviewProps) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const { mutate: deleteComment, isPending: isPendingCommentDelete } =
    useDeleteComment();
  const { mutate: editComment, isPending: isPendingCommentUpdate } =
    useUpdateComment();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isPending } = useUpdateComment();

  const handleEdit = (commentId: string, comment: string) => {
    setEditingCommentId(commentId);
    setValue(comment);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (commentId: string) => {
    editComment({ param: { commentId }, json: { comment: value } });
    setEditingCommentId(null);
  };

  const handleDelete = (commentId: string) => {
    deleteComment(
      { param: { commentId } },
      {
        onSuccess: () => {
          if (comments.documents.length === 1) {
            window.location.reload();
          }
        },
      }
    );
  };

  return (
    <div className="space-y-2">
      {comments.documents.map((document) => (
        <Card key={document.$id} className="dark:bg-neutral-800">
          <CardTitle>
            <div className="flex flex-col w-full p-2">
              <div className="flex flex-row">
                <MemberAvatar className="size-8 mr-2" names={document.creator} />
                <span>{document.creator}</span>
                <div className="ml-auto">
                  <span className="text-neutral-400 text-xs mr-1">
                    <Button
                      onClick={() =>
                        editingCommentId === document.$id
                          ? setEditingCommentId(null)
                          : handleEdit(document.$id, document.comment)
                      }
                      size="sm"
                      variant="outline"
                      disabled={isPendingCommentUpdate}
                    >
                      {editingCommentId === document.$id ? (
                        <XIcon className="size-4" />
                      ) : (
                        <PencilIcon className="size-4" />
                      )}
                      {editingCommentId === document.$id ? "Cancel" : "Edit"}
                    </Button>
                  </span>
                  <span className="text-neutral-400 text-xs mr-4">
                    <Button
                      onClick={() => handleDelete(document.$id)}
                      size="sm"
                      variant="destructive"
                      disabled={isPendingCommentDelete}
                    >
                      <TrashIcon className="size-4" />
                      Delete
                    </Button>
                  </span>
                </div>
              </div>
              <Separator className="dark:bg-neutral-700 w-[16%] ml-10 -mt-[14px]" />
              <span className="text-neutral-400 text-xs ml-10">
                {formatDistanceToNow(new Date(document.$createdAt))} ago
              </span>
            </div>
          </CardTitle>
          <Separator className="dark:bg-neutral-700 w-[95%] mx-auto" />
          <CardContent className="-mb-8">
            <div className="p-4 w-[95%] my-2 rounded-lg mx-auto dark:bg-neutral-700">
              {editingCommentId === document.$id ? (
                <div className="flex flex-col gap-y-4">
                  <Textarea
                    value={value}
                    rows={4}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isPending}
                    className="dark:bg-neutral-700 dark:text-white font-mono"
                  />
                  <Button
                    size="sm"
                    className="w-fit ml-auto"
                    onClick={() => handleSave(document.$id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader className="size-4 animate-spin" /> Saving
                        Changes
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="break-words">
                  {document.comment && (
                    <CommentContent content={document.comment} />
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <div className="mx-auto mb-2 w-[95%]">
            {document.document && (
              <>
                <Separator className="dark:bg-neutral-700 my-2" />
                <DocumentAttachment file={document.document} />
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommentsOverview;
