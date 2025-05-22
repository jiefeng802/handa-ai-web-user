import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import styles from "./MessageContent.module.scss";

export const MessageContent = ({
                                 text,
                                 isUser,
                                 hide,
                               }: {
  text: string;
  isUser: boolean;
  hide: boolean;
}): JSX.Element => {
  const [showLog] = useState(true);
  const [isLog, setIsLog] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const extractLog = (log: string) => {
    const logRegex = /🧠<([^>]+)>🧠/g;
    const logs = [];
    let match;

    while ((match = logRegex.exec(log))) {
      logs.push("- " + match[1] + "  \n");
    }

    return {
      logs: logs.join(""),
      cleanedText: log.replace(logRegex, ""),
    };
  };

  useEffect(() => {
    if (text.includes("🧠<")) {
      setIsLog(true);
    } else {
      setIsLog(false);
    }
  }, [text]);

  const { logs, cleanedText } = extractLog(text);

  const handleImageClick = useCallback((src: string) => {
    setExpandedImage(src);
  }, []);

  const handleCloseImage = useCallback(() => {
    setExpandedImage(null);
  }, []);

  const ImageComponent = useCallback(({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt || ""}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleImageClick(src);
            }}
            style={{ cursor: 'pointer' }}
        />
    );
  }, [handleImageClick]);

  return (
      <div
          className={hide && !isUser ? styles.hiden : ""}
          data-testid="chat-message-text"
      >
        {isLog && showLog && logs.length > 0 && (
            <div className="text-xs text-white p-2 rounded">
              <ReactMarkdown remarkPlugins={[gfm]}>{logs}</ReactMarkdown>
            </div>
        )}
        <ReactMarkdown
            className={`
        ${styles.markdown} 
        ${isUser ? styles.user : styles.brain}
        ${cleanedText === "🧠" ? styles.thinking : ""} 
        `}
            remarkPlugins={[gfm]}
            components={{
              img: ImageComponent
            }}
        >
          {cleanedText}
        </ReactMarkdown>

        {expandedImage && (
            <div className={styles.imageModal} onClick={handleCloseImage}>
              <img
                  src={expandedImage}
                  alt="Expanded"
                  className={styles.expandedImage}
                  onClick={(e) => e.stopPropagation()}
              />
            </div>
        )}
      </div>
  );
};
