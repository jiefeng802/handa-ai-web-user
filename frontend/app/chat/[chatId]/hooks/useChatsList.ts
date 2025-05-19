import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";
import { useLocalChats } from "@/lib/hooks/useLocalChats";
import { useToast } from "@/lib/hooks";

export const useChatsList = () => {
  const { t } = useTranslation(["chat"]);
  const { setAllChats, setIsLoading } = useChatsContext();
  const { publish } = useToast();
  const { getChats } = useLocalChats();

  useEffect(() => {
    try {
      setIsLoading(true);
      const chats = getChats();
      console.log("从本地存储获取的聊天列表:", chats);
      setAllChats(chats);
      setIsLoading(false);
    } catch (error) {
      console.error("获取聊天列表失败:", error);
      publish({
        variant: "danger",
        text: t("errorFetching", { ns: "chat" }),
      });
      setIsLoading(false);
    }
  }, []);
};
