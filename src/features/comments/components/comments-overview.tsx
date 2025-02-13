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

interface CommentsOverviewProps {
  comments: CommentsResponse;
}

const CommentsOverview = ({ comments }: CommentsOverviewProps) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isPending } = useUpdateComment();

  const handleEdit = (commentId: string, comment: string) => {
    setEditingCommentId(commentId);
    setValue(comment);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (commentId: string) => {};

  return (
    <div className="space-y-2">
      {comments.documents.map((document) => (
        <Card key={document.$id} className="dark:bg-neutral-800">
          <CardTitle>
            <div className="flex flex-col w-full p-2">
              <div className="flex flex-row">
                <MemberAvatar className="size-8 mr-2" name={document.creator} />
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
                      disabled
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
                      onClick={() =>
                        editingCommentId === document.$id
                          ? setEditingCommentId(null)
                          : handleEdit(document.$id, document.comment)
                      }
                      size="sm"
                      variant="destructive"
                      disabled
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
                    className="dark:bg-neutral-700 dark:text-white"
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
                <div>
                  {document.comment && (
                    <p className="w-[95%] mx-auto text-muted-foreground dark:text-white border-none break-all">
                      {document.comment}
                    </p>
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
