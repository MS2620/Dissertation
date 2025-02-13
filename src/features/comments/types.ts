import { Models } from "node-appwrite";

export interface Document extends Models.Document {
  $createdAt: string;
  $updatedAt: string;
}

export interface CommentDocument {
  downloadUrl: string;
  $id: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name?: string;
  signature: string;
  mimeType?: string;
  sizeOriginal?: number;
  chunksTotal: number;
  chunksUploaded: number;
}

export interface Comment extends Document {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: Array<string>;
  taskId: string;
  comment: string;
  creator: string;
  fileId: string;
  document?: CommentDocument;
}

export interface CommentsResponse {
  documents: Comment[];
  total: number;
}

export interface CommentsOverviewProps {
  comments: CommentsResponse;
}
