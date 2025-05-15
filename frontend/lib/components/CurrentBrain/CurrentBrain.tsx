import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

import styles from "./CurrentBrain.module.scss";

import { Icon } from "../ui/Icon/Icon";
// import { LoaderIcon } from "../ui/LoaderIcon/LoaderIcon";

interface CurrentBrainProps {
  allowingRemoveBrain: boolean;
  remainingCredits: number | null;
  isNewBrain?: boolean;
}

export const CurrentBrain = ({
  allowingRemoveBrain,
  remainingCredits,
  isNewBrain,
}: CurrentBrainProps): JSX.Element => {
  const { currentBrain, setCurrentBrainId } = useBrainContext();
  const removeCurrentBrain = (): void => {
    setCurrentBrainId(null);
  };

  if (remainingCredits === 0) {
    return (
      <div className={styles.no_credits_left}>
        <span>
          您已经用完了积分！升级以继续对话。
        </span>
      </div>
    );
  }

  if (!currentBrain) {
    return <></>;
  }

  return (
    <div className={styles.current_brain_wrapper}>
      <div className={styles.brain_infos}>
        <div className={styles.left}>
          <span className={styles.title}>和</span>
          <div className={styles.brain_name_wrapper}>
            <Icon
                name="brain"
                size="small"
                color={isNewBrain ? "primary" : "black"}
            />
            <span
                className={`${styles.brain_name} ${isNewBrain ? styles.new : ""}`}
            >
              {currentBrain.name}
            </span>
            <span className={styles.title}>对话</span>
            {/*{bulkNotifications.some(*/}
            {/*    (bulkNotif) =>*/}
            {/*        bulkNotif.brain_id === currentBrain.id &&*/}
            {/*        bulkNotif.notifications.some((notif) => notif.status === "info")*/}
            {/*) && (*/}
            {/*    <div className={styles.warning}>*/}
            {/*      <LoaderIcon size="small" color="warning"/>*/}
            {/*      <span>正在处理知识</span>*/}
            {/*    </div>*/}
            {/*)}*/}
          </div>
        </div>
        {allowingRemoveBrain && (
            <div
            onClick={(event) => {
              event.nativeEvent.stopImmediatePropagation();
              removeCurrentBrain();
            }}
          >
            <Icon size="normal" name="close" color="black" handleHover={true} />
          </div>
        )}
      </div>
    </div>
  );
};
