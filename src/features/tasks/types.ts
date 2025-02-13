import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

interface Assignee {
  $id: string;
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $permissions: string[];
  $updatedAt: string;
  email: string;
  name: string;
  role: string;
  userId: string;
  workspaceId: string;
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assignees: Assignee[];
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};
