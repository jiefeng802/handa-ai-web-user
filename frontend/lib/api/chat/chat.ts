import { AxiosInstance } from "axios";

import {
  ChatEntity,
  ChatItem,
  ChatMessage,
  ChatQuestion,
} from "@/app/chat/[chatId]/types";
import { useLocalChats } from "@/lib/hooks/useLocalChats";

export type ChatUpdatableProperties = {
  chat_name?: string;
};

export type ChatMessageUpdatableProperties = {
  thumbs?: boolean | null;
};

const CHATS_STORAGE_KEY = "local_chats";

export const saveChatToLocal = (chat: ChatEntity) => {
  try {
    const chatsStr = localStorage.getItem(CHATS_STORAGE_KEY);
    const chats = chatsStr ? JSON.parse(chatsStr) as ChatEntity[] : [];
    chats.unshift(chat); // 添加到列表开头
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chat to local storage:", error);
  }
};

export const createChat = async (
  name: string,
  axiosInstance: AxiosInstance
): Promise<ChatEntity> => {
  const createdChat = (
    await axiosInstance.post<ChatEntity>("/chat", { name: name })
  ).data;

  // 保存到本地存储
  saveChatToLocal(createdChat);

  return createdChat;
};

export const getChats = async (
  axiosInstance: AxiosInstance
): Promise<ChatEntity[]> => {
  const response = await axiosInstance.get<{
    chats: ChatEntity[];
  }>(`/chat`);

  return response.data.chats;
};

export const deleteChat = async (
  chatId: string,
  axiosInstance: AxiosInstance
): Promise<void> => {
  await axiosInstance.delete(`/chat/${chatId}`);
};

export type AddQuestionParams = {
  chatId: string;
  chatQuestion: ChatQuestion;
  brainId: string;
};

export const addQuestion = async (
  { chatId, chatQuestion, brainId }: AddQuestionParams,
  axiosInstance: AxiosInstance
): Promise<ChatMessage> => {
  const response = await axiosInstance.post<ChatMessage>(
    `/chat/${chatId}/question?brain_id=${brainId}`,
    chatQuestion
  );

  return response.data;
};

export const getChatItems = async (
  chatId: string,
  axiosInstance: AxiosInstance
): Promise<ChatItem[]> =>
  (await axiosInstance.get<ChatItem[]>(`/chat/${chatId}/history`)).data;

export const updateChat = async (
  chatId: string,
  chat: ChatUpdatableProperties,
  axiosInstance: AxiosInstance
): Promise<ChatEntity> => {
  return (await axiosInstance.put<ChatEntity>(`/chat/${chatId}/metadata`, chat))
    .data;
};

export const updateChatMessage = async (
  chatId: string,
  messageId: string,
  chatMessageUpdatableProperties: ChatMessageUpdatableProperties,
  axiosInstance: AxiosInstance
): Promise<ChatItem> => {
  return (
    await axiosInstance.put<ChatItem>(
      `/chat/${chatId}/${messageId}`,
      chatMessageUpdatableProperties
    )
  ).data;
};
