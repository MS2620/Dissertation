import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCommentSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import {
  COMMENTS_ID,
  DATABASE_ID,
  DOCUMENTS_ID,
  MEMBERS_ID,
  TASKS_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";

import { Comment } from "../types";
import { MemberRole } from "@/features/members/types";

// Base types
interface BaseComment {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  $createdAt: string;
  $updatedAt: string;
  taskId: string;
  comment: string;
  creator: string;
  fileId: string;
}

interface StorageFile {
  $id: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}

// API endpoint types
interface CommentDocument extends StorageFile {
  downloadUrl: string;
}

interface PopulatedComment extends BaseComment {
  creator: string;
  document?: CommentDocument;
}

interface CommentsResponse {
  documents: PopulatedComment[];
  total: number;
}

const app = new Hono()
  .delete("/:commentId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { commentId } = c.req.param();

    const comment = await databases.getDocument<Comment>(
      DATABASE_ID,
      COMMENTS_ID,
      commentId
    );

    const taskComment = comment?.taskId;

    const task = await databases.getDocument(
      DATABASE_ID,
      TASKS_ID,
      taskComment
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!comment) {
      return c.json({ error: "Task not found" }, 404);
    }

    if (member.role !== MemberRole.ADMIN || member.$id !== comment.creator) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, COMMENTS_ID, commentId);

    return c.json({ data: { $id: comment.$id } });
  })

  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        taskId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { taskId } = c.req.valid("query");

      const query = [
        Query.equal("taskId", taskId),
        Query.orderDesc("$createdAt"),
      ];

      const comment = await databases.listDocuments<BaseComment>(
        DATABASE_ID,
        COMMENTS_ID,
        query
      );

      const creatorIds = comment.documents.map((c) => c.creator);

      const validCreatorIds = creatorIds.filter(
        (id): id is string => id !== undefined
      );

      const creators = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.contains("$id", validCreatorIds),
      ]);

      const creatorUsers = await Promise.all(
        creators.documents.map(async (creator) => {
          const user = await users.get(creator.userId);
          return { ...creator, name: user.name, email: user.email };
        })
      );

      const documents = await Promise.all(
        comment.documents
          .filter((c) => c.fileId)
          .map(async (c) => {
            const file = await storage.getFile(DOCUMENTS_ID, c.fileId);
            const downloadUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${DOCUMENTS_ID}/files/${c.fileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;

            return {
              commentId: c.$id,
              file: {
                ...file,
                downloadUrl,
              } as CommentDocument,
            };
          })
      );

      const populatedComments = comment.documents.map((c) => {
        const creator = creatorUsers.find((cr) => cr.$id === c.creator);
        const document = documents.find((d) => d.commentId === c.$id);
        return {
          ...c,
          document: document?.file,
          creator: creator?.name ?? c.creator,
        } as PopulatedComment;
      });

      return c.json({
        data: {
          ...comment,
          documents: populatedComments,
        } as CommentsResponse,
      });
    }
  )

  .post("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const storage = c.get("storage");

    try {
      // Parse the multipart form data
      const formData = await c.req.formData();

      const taskId = formData.get("taskId");
      const workspaceId = formData.get("workspaceId");
      const comment = formData.get("comment");
      const document = formData.get("document");

      if (!taskId || !comment || !workspaceId) {
        return c.json({ error: "Missing required fields" });
      }

      const member = await getMember({
        databases,
        workspaceId: workspaceId as string,
        userId: user.$id,
      });

      let uploadedDocument = null;

      if (document instanceof File) {
        const uploadedFile = await storage.createFile(
          DOCUMENTS_ID,
          ID.unique(),
          document
        );
        uploadedDocument = uploadedFile.$id;
      }

      const newComment = await databases.createDocument(
        DATABASE_ID,
        COMMENTS_ID,
        ID.unique(),
        {
          taskId,
          comment,
          creator: member.$id,
          fileId: uploadedDocument,
        }
      );

      return c.json({ data: newComment });
    } catch (error) {
      console.error("Error creating comment:", error);
      return c.json({ error: "Failed to create comment" });
    }
  })

  .patch(
    "/:commentId",
    sessionMiddleware,
    zValidator("json", createCommentSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");
      const { comment, document } = c.req.valid("json");
      const { commentId } = c.req.param();

      const existingComment = await databases.getDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        commentId
      );

      const taskComment = existingComment?.taskId;

      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        taskComment
      );

      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (
        member.role !== MemberRole.ADMIN ||
        member.$id !== existingComment.creator
      ) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedDocument = null;

      if (document instanceof File) {
        const uploadedFile = await storage.createFile(
          DOCUMENTS_ID,
          ID.unique(),
          document
        );
        uploadedDocument = uploadedFile.$id;
      }

      const updatedComment = await databases.updateDocument(
        DATABASE_ID,
        COMMENTS_ID,
        commentId,
        {
          comment,
          document: document ? uploadedDocument : existingComment.document,
        }
      );

      return c.json({ data: updatedComment });
    }
  );

export default app;
