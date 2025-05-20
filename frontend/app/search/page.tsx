"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { QuivrLogo } from "@/lib/assets/QuivrLogo";
import { PageHeader } from "@/lib/components/PageHeader/PageHeader";
import Icon from "@/lib/components/ui/Icon/Icon";
import { SearchBar } from "@/lib/components/ui/SearchBar/SearchBar";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useUserSettingsContext } from "@/lib/context/UserSettingsProvider/hooks/useUserSettingsContext";
import { useUserData } from "@/lib/hooks/useUserData";
import { ButtonType } from "@/lib/types/QuivrButton";

import BrainButton from "./BrainButton/BrainButton";
import styles from "./page.module.scss";

const Search = (): JSX.Element => {
  const [isNewBrain, setIsNewBrain] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("");
  const brainsPerPage = 6;

  const { userData } = useUserData();
  const { isDarkMode } = useUserSettingsContext();
  const { allBrains } = useBrainContext();

  const [buttons, setButtons] = useState<ButtonType[]>([
  ]);

  const newBrain = () => {
    setIsNewBrain(true);
    setTimeout(() => {
      setIsNewBrain(false);
    }, 750);
  };

  const totalPages = Math.ceil(allBrains.length / brainsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setTransitionDirection("next");
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setTransitionDirection("prev");
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (userData) {
      setButtons((prevButtons) => {
        return prevButtons.map((button) => {
          if (button.label === "创建知识库") {
            return {
              ...button,
              disabled: userData.max_brains <= allBrains.length,
            };
          }

          return button;
        });
      });
    }
  }, [userData?.max_brains, allBrains.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement) {
        const tagName = document.activeElement.tagName.toLowerCase();
        if (tagName !== "body") {
          return;
        }
      }

      switch (event.key) {
        case "ArrowLeft":
          handlePreviousPage();
          break;
        case "ArrowRight":
          handleNextPage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePreviousPage, handleNextPage]);

  const displayedBrains = allBrains.slice(
    currentPage * brainsPerPage,
    (currentPage + 1) * brainsPerPage
  );

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.page_header}>
          <PageHeader iconName="home" label="主页" buttons={buttons} />
        </div>
        <div className={styles.search_page_container}>
          <div className={styles.main_wrapper}>
            <div className={styles.quivr_logo_wrapper}>
              <QuivrLogo size={80} color={isDarkMode ? "white" : "black"} />
              <div className={styles.quivr_text}>
                <span>和</span>
                <span className={styles.quivr_text_primary}>答小智</span>
                <span>聊天</span>
              </div>
            </div>
            <div className={styles.search_bar_wrapper}>
              <SearchBar newBrain={isNewBrain} />
            </div>
            <div className={styles.brains_list_container}>
              <div
                className={`${styles.chevron} ${
                  currentPage === 0 ? styles.disabled : ""
                }`}
                onClick={handlePreviousPage}
              >
                <Icon
                  name="chevronLeft"
                  size="big"
                  color="black"
                  handleHover={true}
                />
              </div>
              <div
                className={`${styles.brains_list_wrapper} ${
                  transitionDirection === "next"
                    ? styles.slide_next
                    : styles.slide_prev
                }`}
              >
                {displayedBrains.map((brain, index) => (
                  <BrainButton key={index} brain={brain} newBrain={newBrain} />
                ))}
              </div>
              <div
                className={`${styles.chevron} ${
                  currentPage >= totalPages - 1 ? styles.disabled : ""
                }`}
                onClick={handleNextPage}
              >
                <Icon
                  name="chevronRight"
                  size="big"
                  color="black"
                  handleHover={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
