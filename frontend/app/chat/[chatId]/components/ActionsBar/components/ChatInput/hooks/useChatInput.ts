import { useCallback, useState } from "react";

import { useChat } from "@/app/chat/[chatId]/hooks/useChat";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { addQuestion, generatingAnswer, chatId } = useChat();

  const submitQuestion = useCallback(
    (question?: string, image?: File | null) => {
      const finalMessage = question ?? message;
      if (!generatingAnswer) {
        void addQuestion(finalMessage, image ?? imageFile, () => {
          setMessage("");
          setImageFile(null);
          setPreviewImage(null);
        });
      }
    },
    [addQuestion, generatingAnswer, message, imageFile]
  );

  return {
    message,
    setMessage,
    imageFile,
    setImageFile,
    previewImage,
    setPreviewImage,
    submitQuestion,
    generatingAnswer,
    chatId,
  };
};
