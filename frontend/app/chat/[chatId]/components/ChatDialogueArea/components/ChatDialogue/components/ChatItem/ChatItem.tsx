import { QADisplay } from "./QADisplay";

import { ChatItemWithGroupedNotifications } from "../../../../types";

type ChatItemProps = {
  content: ChatItemWithGroupedNotifications;
  index: number;
  lastMessage?: boolean;
};
export const ChatItem = ({
  content,
  index,
  lastMessage,
}: ChatItemProps): JSX.Element => {
  console.log("content 2", content)
  if (content.item_type === "MESSAGE") {
    return (
      <QADisplay
        content={content.body}
        index={index}
        lastMessage={lastMessage}
      />
    );
  }

  return <></>;
};
