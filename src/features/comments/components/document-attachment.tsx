import React from "react";
import { FileText, Table, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AllowedFileTypes = "pdf" | "docx" | "xlsx" | "svg";

interface DocumentAttachmentProps {
  file: {
    sizeOriginal?: number;
    name?: string;
    mimeType?: string;
    downloadUrl?: string;
  };
}

const DocumentAttachment = ({ file }: DocumentAttachmentProps) => {
  // Determine file type from mime type or extension
  const getFileType = (): AllowedFileTypes | null => {
    if (file.mimeType) {
      if (file.mimeType === "application/pdf") return "pdf";
      if (
        file.mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return "docx";
      if (
        file.mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return "xlsx";
      if (file.mimeType === "image/svg+xml") return "svg";
    }

    // Fallback to checking file extension
    const extension = file.name?.split(".").pop()?.toLowerCase();
    if (["pdf", "docx", "xlsx", "svg"].includes(extension || "")) {
      return extension as AllowedFileTypes;
    }

    return null;
  };

  // Get appropriate icon based on file type
  const FileIcon = () => {
    const type = getFileType();
    switch (type) {
      case "pdf":
      case "docx":
        return <FileText className="size-5" />;
      case "xlsx":
        return <Table className="size-5" />;
      case "svg":
        return <FileCode className="size-5" />;
      default:
        return <FileText className="size-5" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Get file type label
  const getFileTypeLabel = () => {
    const type = getFileType();
    switch (type) {
      case "pdf":
        return "PDF Document";
      case "docx":
        return "Word Document";
      case "xlsx":
        return "Excel Spreadsheet";
      case "svg":
        return "SVG Image";
      default:
        return "Document";
    }
  };

  return (
    <Card className="p-4 dark:bg-neutral-700">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center size-10 bg-muted rounded">
            <FileIcon />
          </div>
          <div className="truncate">
            <p className="font-medium truncate">{file.name || "Attachment"}</p>
            <p className="text-sm text-muted-foreground">
              {getFileTypeLabel()} • {formatFileSize(file.sizeOriginal)}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(file.downloadUrl, "_blank")}
          className="shrink-0"
        >
          Download Document
        </Button>
      </div>
    </Card>
  );
};

export default DocumentAttachment;
