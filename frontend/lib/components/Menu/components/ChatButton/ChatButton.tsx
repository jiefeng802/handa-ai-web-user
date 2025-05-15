import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuButton } from "@/lib/components/Menu/components/MenuButton/MenuButton";

export const ChatButton = (): JSX.Element => {
  const pathname = usePathname();
  console.log("pathname", pathname); // 打印 pathname
  const isSelected = pathname ? pathname.includes("/conversation") : true;

  return (
    <Link href={`/conversation`}>
      <MenuButton
        label="对话"
        isSelected={isSelected}
        iconName="messageCircle"
        type="open"
        color="primary"
      />
    </Link>
  );
};
