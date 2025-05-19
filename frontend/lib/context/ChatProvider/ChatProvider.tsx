"use client";

import { createContext, useEffect, useState } from "react";

import { ChatMessage, Notification } from "@/app/chat/[chatId]/types";

import { ChatContextProps } from "./types";

const MESSAGES_STORAGE_KEY = "local_messages";
const NOTIFICATIONS_STORAGE_KEY = "local_notifications";

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 初始化时从本地存储加载数据
  useEffect(() => {
    try {
      const messagesStr = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const notificationsStr = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      
      if (messagesStr) {
        const loadedMessages = JSON.parse(messagesStr) as ChatMessage[];
        console.log("从本地存储加载的消息:", loadedMessages);
        setMessages(loadedMessages);
      }
      
      if (notificationsStr) {
        const loadedNotifications = JSON.parse(notificationsStr) as Notification[];
        console.log("从本地存储加载的通知:", loadedNotifications);
        setNotifications(loadedNotifications);
      }
    } catch (error) {
      console.error("加载本地存储数据失败:", error);
    }
  }, []);

  const updateStreamingHistory = (streamedChat: ChatMessage): void => {
    setMessages((prevHistory: ChatMessage[]) => {
      const updatedHistory = prevHistory.find(
        (item) => item.message_id === streamedChat.message_id
      )
        ? prevHistory.map((item: ChatMessage) =>
            item.message_id === streamedChat.message_id
              ? {
                  ...item,
                  assistant: item.assistant + streamedChat.assistant,
                  metadata: streamedChat.metadata,
                }
              : item
          )
        : [...prevHistory, streamedChat];

      // 保存到本地存储
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log("更新后的消息历史:", updatedHistory);

      return updatedHistory;
    });
  };

  const removeMessage = (id: string): void => {
    setMessages((prevHistory: ChatMessage[]) => {
      const updatedHistory = prevHistory.filter((item) => item.message_id !== id);
      // 保存到本地存储
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log("删除消息后的历史:", updatedHistory);
      return updatedHistory;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        updateStreamingHistory,
        removeMessage,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
