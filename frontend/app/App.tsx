"use client";

import { Footer } from '@/componennts/footer';
import { Menu } from "@/lib/components/Menu/Menu";
import { useOutsideClickListener } from "@/lib/components/Menu/hooks/useOutsideClickListener";
import { SearchModal } from "@/lib/components/SearchModal/SearchModal";
import {
  BrainProvider,
  ChatProvider,
} from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { ChatsProvider } from "@/lib/context/ChatsProvider";
import { MenuProvider } from "@/lib/context/MenuProvider/Menu-provider";
import { useMenuContext } from "@/lib/context/MenuProvider/hooks/useMenuContext";
import { OnboardingProvider } from "@/lib/context/OnboardingProvider/Onboarding-provider";
import { SearchModalProvider } from "@/lib/context/SearchModalProvider/search-modal-provider";
import { UserSettingsProvider } from "@/lib/context/UserSettingsProvider/User-settings.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { posthog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PropsWithChildren, useEffect } from "react";

import "../lib/config/LocaleConfig/i18n";
import styles from "./App.module.scss";

if (
  process.env.NEXT_PUBLIC_POSTHOG_KEY != null &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST != null
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    opt_in_site_apps: true,
    disable_session_recording: true,
  });
}

// This wrapper is used to make effect calls at a high level in app rendering.
const App = ({ children }: PropsWithChildren): JSX.Element => {
  const { fetchAllBrains } = useBrainContext();
  const { onClickOutside } = useOutsideClickListener();
  const { isOpened } = useMenuContext();

    useEffect(() => {
        void fetchAllBrains();
    }, []);

  return (
    <>
      <PostHogProvider client={posthog}>
          <div className="flex flex-1 flex-col overflow-auto">
            <SearchModalProvider>
              <SearchModal />
              <div className={styles.app_container}>
                <div className={styles.menu_container}>
                  <Menu />
                </div>
                <div
                  onClick={onClickOutside}
                  className={`${styles.content_container} ${isOpened ? styles.blured : ""
                    }`}
                  style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'hidden' }}
                >
                  {
                    children
                  }
                  <Footer styles={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
                </div>
              </div>
            </SearchModalProvider>
          </div>
      </PostHogProvider>
    </>
  );
};

const queryClient = new QueryClient();

const AppWithQueryClient = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSettingsProvider>
        <BrainProvider>
                <MenuProvider>
                  <OnboardingProvider>
                      <ChatsProvider>
                        <ChatProvider>
                          <App>{children}</App>
                        </ChatProvider>
                      </ChatsProvider>
                  </OnboardingProvider>
                </MenuProvider>
        </BrainProvider>
      </UserSettingsProvider>
    </QueryClientProvider>
  );
};

export { AppWithQueryClient as App };
