import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import { ToastProvider } from "@/lib/components/ui/Toast";

import { App } from "./App";
import "./globals.css";
import styles from "./layout.module.scss";

export const metadata = {
  title: "答小智 - 你的知识库AI问答助手",
  description:
      "知识库AI智能问答助手，用于存储，检索，回复任何信息",
};

const RootLayout = async ({
                            children,
                          }: {
  children: React.ReactNode;
}): Promise<JSX.Element> => {

  return (
      <html lang="en">
      <body className={styles.body}>
      <ToastProvider>
          <App>{children}</App>
      </ToastProvider>
      <Toaster position="top-right" />
      <VercelAnalytics />
      {/*<ChatWidget /> /!* 使用客户端组件 *!/*/}
      </body>
      </html>
  );
};

export default RootLayout;