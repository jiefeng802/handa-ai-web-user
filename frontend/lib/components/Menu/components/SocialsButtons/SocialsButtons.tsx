import { useEffect, useState } from "react";

import { Icon } from "@/lib/components/ui/Icon/Icon";
import { useUserSettingsContext } from "@/lib/context/UserSettingsProvider/hooks/useUserSettingsContext";
import { QrcodeButton } from "../../components/Qrcode/QrcodeButton";

import styles from "./SocialsButtons.module.scss";

export const SocialsButtons = (): JSX.Element => {
  const { isDarkMode, setIsDarkMode } = useUserSettingsContext();
  const [lightModeIconName, setLightModeIconName] = useState("sun");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    setLightModeIconName(isDarkMode ? "sun" : "moon");
  }, [isDarkMode]);

  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className={styles.socials_buttons_wrapper}>
      <Icon
        name={lightModeIconName}
        color="black"
        handleHover={true}
        size="normal"
        onClick={toggleTheme}
      />
    </div >
  );
};
