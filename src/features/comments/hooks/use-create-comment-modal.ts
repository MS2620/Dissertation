import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateCommentModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-comment",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
