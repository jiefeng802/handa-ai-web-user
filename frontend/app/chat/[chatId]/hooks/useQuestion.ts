import { useTranslation } from "react-i18next";

import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useFetch, useToast } from "@/lib/hooks";

import { useHandleStream } from "./useHandleStream";

import { ChatQuestion } from "../types";
import { generatePlaceHolderMessage } from "../utils/generatePlaceHolderMessage";

interface UseChatService {
  addStreamQuestion: (
    chatId: string,
    chatQuestion: ChatQuestion
  ) => Promise<void>;
}

export const useQuestion = (): UseChatService => {
  const { fetchInstance } = useFetch();
  const { currentBrain } = useBrainContext();

  const { t } = useTranslation(["chat"]);
  const { publish } = useToast();
  const { handleStream } = useHandleStream();
  const { removeMessage, updateStreamingHistory } = useChatContext();

  const handleFetchError = async (response: Response) => {
    if (response.status === 429) {
      publish({
        variant: "danger",
        text: t("tooManyRequests", { ns: "chat" }),
      });

      return;
    }

    const errorMessage = (await response.json()) as { detail: string };
    publish({
      variant: "danger",
      text: errorMessage.detail,
    });
  };

  const addStreamQuestion = async (
    chatId: string,
    chatQuestion: ChatQuestion
  ): Promise<void> => {
    const headers = {
      Accept: "text/event-stream",
    };

    const placeHolderMessage = generatePlaceHolderMessage({
      user_message: chatQuestion.question ?? "",
      chat_id: chatId,
    });
    updateStreamingHistory(placeHolderMessage);

    try {
      let url = `/chat/${chatId}/question/stream`;
      const queryParams = new URLSearchParams();
      
      if (currentBrain?.id) {
        queryParams.append("brain_id", currentBrain.id);
      }
      if (chatQuestion.model) {
        queryParams.append("model", chatQuestion.model);
      }
      if (chatQuestion.temperature) {
        queryParams.append("temperature", chatQuestion.temperature.toString());
      }
      if (chatQuestion.max_tokens) {
        queryParams.append("max_tokens", chatQuestion.max_tokens.toString());
      }
      if (chatQuestion.prompt_id) {
        queryParams.append("prompt_id", chatQuestion.prompt_id);
      }
      if (chatQuestion.question) {
        queryParams.append("question", chatQuestion.question);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      let body: FormData | null = null;
      if (chatQuestion.image) {
        body = new FormData();
        body.append("image", chatQuestion.image);
      }

      const response = await fetchInstance.post(url, body, headers);
      if (!response.ok) {
        void handleFetchError(response);
        return;
      }

      if (response.body === null) {
        throw new Error(t("resposeBodyNull", { ns: "chat" }));
      }

      await handleStream(response.body.getReader(), () =>
        removeMessage(placeHolderMessage.message_id)
      );
    } catch (error) {
      publish({
        variant: "danger",
        text: String(error),
      });
    }
  };

  return {
    addStreamQuestion,
  };
};
