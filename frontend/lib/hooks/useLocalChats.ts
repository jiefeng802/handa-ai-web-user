import { useCallback } from "react";
import { useChatsContext } from "../context/ChatsProvider/hooks/useChatsContext";
import { saveChatToLocal } from "../api/chat/chat";
import { ChatEntity } from "@/app/chat/[chatId]/types";

const CHATS_STORAGE_KEY = "local_chats";

export const useLocalChats = () => {
  const { setAllChats } = useChatsContext();

  const getChats = useCallback(() => {
    const chatsStr = localStorage.getItem(CHATS_STORAGE_KEY);
    return chatsStr ? JSON.parse(chatsStr) as ChatEntity[] : [];
  }, []);

  const saveChats = useCallback((chats: ChatEntity[]) => {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    setAllChats(chats);
  }, [setAllChats]);

  const addChat = useCallback((chat: ChatEntity) => {
    saveChatToLocal(chat);
    const chats = getChats();
    setAllChats(chats);
  }, [getChats, setAllChats]);

  const updateChat = useCallback((chatId: string, updates: Partial<ChatEntity>) => {
    const chats = getChats();
    const updatedChats = chats.map(chat => 
      chat.chat_id === chatId ? { ...chat, ...updates } : chat
    );
    saveChats(updatedChats);
  }, [getChats, saveChats]);

  const deleteChat = useCallback((chatId: string) => {
    const chats = getChats();
    const filteredChats = chats.filter(chat => chat.chat_id !== chatId);
    saveChats(filteredChats);
  }, [getChats, saveChats]);

  return {
    getChats,
    addChat,
    updateChat,
    deleteChat
  };
}; 