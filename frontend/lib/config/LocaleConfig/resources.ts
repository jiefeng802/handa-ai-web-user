
// import all namespaces Simplified Chinese
import brain_zh_cn from "../../../public/locales/zh-cn/brain.json";
import chat_zh_cn from "../../../public/locales/zh-cn/chat.json";
import config_zh_cn from "../../../public/locales/zh-cn/config.json";
import contact_zh_cn from "../../../public/locales/zh-cn/contact.json";
import delete_brain_zh_cn from "../../../public/locales/zh-cn/deleteOrUnsubscribeFromBrain.json";
import explore_zh_cn from "../../../public/locales/zh-cn/explore.json";
import external_api_definition_zh_cn from "../../../public/locales/zh-cn/external_api_definition.json";
import home_zh_cn from "../../../public/locales/zh-cn/home.json";
import invitation_zh_cn from "../../../public/locales/zh-cn/invitation.json";
import knowlegde_zh_cn from "../../../public/locales/zh-cn/knowledge.json";
import login_zh_cn from "../../../public/locales/zh-cn/login.json";
import logout_zh_cn from "../../../public/locales/zh-cn/logout.json";
import monetization_zh_cn from "../../../public/locales/zh-cn/monetization.json";
import translation_zh_cn from "../../../public/locales/zh-cn/translation.json";
import upload_zh_cn from "../../../public/locales/zh-cn/upload.json";
import user_zh_cn from "../../../public/locales/zh-cn/user.json";

//type all translations
export type Translations = NonNullable<unknown>;

enum SupportedLanguages {
  zh_cn = "zh_cn",
}

export const defaultNS = "translation";
export const resources: Record<SupportedLanguages, Translations> = {
  zh_cn: {
    brain: brain_zh_cn,
    chat: chat_zh_cn,
    config: config_zh_cn,
    contact: contact_zh_cn,
    explore: explore_zh_cn,
    home: home_zh_cn,
    invitation: invitation_zh_cn,
    login: login_zh_cn,
    logout: logout_zh_cn,
    monetization: monetization_zh_cn,
    translation: translation_zh_cn,
    upload: upload_zh_cn,
    user: user_zh_cn,
    delete_or_unsubscribe_from_brain: delete_brain_zh_cn,
    knowledge: knowlegde_zh_cn,
    external_api_definition: external_api_definition_zh_cn,
  },
} as const;
