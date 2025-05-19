"use client";

import { createContext, useEffect, useState } from "react";
import { ChatEntity } from "@/app/chat/[chatId]/types";

type ChatsContextType = {
  allChats: ChatEntity[];
  setAllChats: React.Dispatch<React.SetStateAction<ChatEntity[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatsContext = createContext<ChatsContextType | undefined>(
  undefined
);

const CHATS_STORAGE_KEY = "local_chats";

export const ChatsProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [allChats, setAllChats] = useState<ChatEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化时从本地存储加载数据
  useEffect(() => {
    try {
      const chatsStr = localStorage.getItem(CHATS_STORAGE_KEY);
      if (chatsStr) {
        const chats = JSON.parse(chatsStr) as ChatEntity[];
        console.log("ChatsProvider 初始化加载的聊天列表:", chats);
        setAllChats(chats);
      }
    } catch (error) {
      console.error("ChatsProvider 初始化加载失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ChatsContext.Provider
      value={{
        allChats,
        setAllChats,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
