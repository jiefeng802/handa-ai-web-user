"use client";

import { UUID } from "crypto";
import { useEffect, useCallback, useMemo } from "react";

import { PageHeader } from "@/lib/components/PageHeader/PageHeader";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { cn } from "@/lib/utils";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useParams } from "next/navigation";
import { getMessagesFromChatItems } from "./utils/getMessagesFromChatItems";
import { ChatMessage } from "./types";

import { ActionsBar } from "./components/ActionsBar";
import { ChatDialogueArea } from "./components/ChatDialogueArea/ChatDialogue";
import styles from "./page.module.scss";

const SelectedChatPage = (): JSX.Element => {
  const params = useParams();
  const chatId = params?.chatId as string;
  const { currentBrain, setCurrentBrainId } = useBrainContext();
  const { messages, setMessages } = useChatContext();
  const { getChatItems } = useChatApi();

  const fetchChatHistory = useCallback(async () => {
    if (!chatId) return;
    
    try {
      const chatItems = await getChatItems(chatId);
      const chatMessages = getMessagesFromChatItems(chatItems);
      const ongoingMessages = messages.filter((msg: ChatMessage) => 
        msg.assistant.endsWith('🧠')
      );
      setMessages([...chatMessages, ...ongoingMessages]);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, [chatId, getChatItems, setMessages]);

  useEffect(() => {
    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]);

  useEffect(() => {
    if (!currentBrain && messages.length > 0) {
      setCurrentBrainId(messages[messages.length - 1].brain_id as UUID);
    }
  }, [messages]);

  return (
    <div className={styles.main_container}>
      <div className={styles.page_header}>
        <PageHeader iconName="chat" label="对话" buttons={[]} />
      </div>
      <div
        className={styles.chat_page_container}
        {...({})}
      >
        <div
          className={cn(
            "flex flex-col flex-1 items-center justify-stretch w-full h-full overflow-hidden",
            "dark:bg-black transition-colors ease-out duration-500"
          )}
        >
          <div
            className={`flex flex-col flex-1 w-full max-w-4xl h-full dark:shadow-primary/25 overflow-hidden`}
          >
            <div className="flex flex-1 flex-col overflow-y-auto">
              <ChatDialogueArea />
            </div>
            <ActionsBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedChatPage;
