import { z } from "zod";

export const createCommentSchema = z.object({
  taskId: z.string().trim().min(1, "Required"),
  comment: z.string().trim().min(1, "Required").max(2048, "Too long"),
  workspaceId: z.string().trim().min(1, "Required"),
  document: z.any().nullable().optional(),
});
