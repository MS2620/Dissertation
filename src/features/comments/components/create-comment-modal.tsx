"use client";
import React from "react";
import { useCreateCommentModal } from "../hooks/use-create-comment-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateCommentFormWrapper } from "./create-comment-form-wrapper";

export const CreateCommentModal = () => {
  const { isOpen, setIsOpen, close } = useCreateCommentModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateCommentFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
