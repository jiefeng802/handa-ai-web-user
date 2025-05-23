import { useTranslation } from "react-i18next";

import { ChatItem } from "./components";
import { useChatDialogue } from "./hooks/useChatDialogue";
import {
  chatDialogueContainerClassName,
  chatItemContainerClassName,
} from "./styles";
import { getKeyFromChatItem } from "./utils/getKeyFromChatItem";

import { ChatItemWithGroupedNotifications } from "../../types";

type MessagesDialogueProps = {
  chatItems: ChatItemWithGroupedNotifications[];
};

export const ChatDialogue = ({
  chatItems,
}: MessagesDialogueProps): JSX.Element => {
    console.log("ChatDialogue ", chatItems.length)
    console.log("ChatDialogue 2 ", chatItems)
  const { t } = useTranslation(["chat"]);
  const { chatListRef } = useChatDialogue();

  // return (
  //     <div className={chatDialogueContainerClassName} ref={chatListRef}>
  //       <div className={chatItemContainerClassName}>
  //         {chatItems.map((chatItem, index) => (
  //             <ChatItem
  //                 key={getKeyFromChatItem(chatItem)}
  //                 content={chatItem}
  //                 index={index}
  //             />
  //         ))}
  //       </div>
  //     </div>
  // );

  return (
    <div className={chatDialogueContainerClassName} ref={chatListRef}>
      <div className={chatItemContainerClassName}>
        {chatItems.map((chatItem, index) => (
          <ChatItem
            key={getKeyFromChatItem(chatItem)}
            content={chatItem}
            index={index}
            lastMessage={index === chatItems.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
