"use client";

import { CurrentBrain } from "@/lib/components/CurrentBrain/CurrentBrain";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { LoaderIcon } from "@/lib/components/ui/LoaderIcon/LoaderIcon";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useUserSettingsContext } from "@/lib/context/UserSettingsProvider/hooks/useUserSettingsContext";
import { Mic, MicOff, Image as ImageIcon, X } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/lib/hooks/useToast";

import { ChatEditor } from "./components/ChatEditor/ChatEditor";
import { useChatInput } from "./hooks/useChatInput";
import styles from "./index.module.scss";

export const ChatInput = (): JSX.Element => {
  const { 
    setMessage, 
    submitQuestion, 
    generatingAnswer, 
    message,
    imageFile,
    setImageFile,
    previewImage,
    setPreviewImage
  } = useChatInput();
  const { remainingCredits } = useUserSettingsContext();
  const { currentBrain } = useBrainContext();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { publish } = useToast();

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) return;

        // 创建预览图
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setImageFile(file);
        break;
      }
    }
  };

  const removePreview = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleSubmitQuestion = (question?: string) => {
    const finalQuestion = question ?? message;
    if (finalQuestion.trim() !== "" && remainingCredits && currentBrain) {
      submitQuestion(finalQuestion, imageFile);
    }
  };

  const startRecording = async () => {
    try {
      // 检查浏览器是否支持 getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        publish({
          variant: "danger",
          text: "您的浏览器不支持录音功能",
        });
        return;
      }

      // 清空之前的录音数据
      audioChunksRef.current = [];

      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 设置更短的间隔来收集数据
      mediaRecorder.start(100); // 每100ms收集一次数据
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          publish({
            variant: "danger",
            text: "请允许使用麦克风。您可以在浏览器设置中修改权限。",
          });
        } else if (error.name === "NotFoundError") {
          publish({
            variant: "danger",
            text: "未找到麦克风设备",
          });
        } else if (error.name === "NotReadableError") {
          publish({
            variant: "danger",
            text: "麦克风设备被其他应用占用",
          });
        } else {
          publish({
            variant: "danger",
            text: "无法访问麦克风，请检查设备连接",
          });
        }
      }
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      // 确保在停止前收集最后的数据
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // 等待一小段时间确保所有数据都被收集
      await new Promise(resolve => setTimeout(resolve, 100));

      // 确保有录音数据
      if (audioChunksRef.current.length === 0) {
        publish({
          variant: "danger",
          text: "没有录到声音，请检查麦克风是否正常工作",
        });
        setIsRecording(false);
        return;
      }

      // 将音频数据转换为 WAV 格式
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: "audio/wav"
      });

      // 检查音频大小
      if (audioBlob.size < 1000) { // 小于1KB的音频可能是无效的
        publish({
          variant: "danger",
          text: "录音时间太短，请至少录制1-2秒",
        });
        setIsRecording(false);
        return;
      }

      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.wav");

      try {
        const token = `${process.env.NEXT_PUBLIC_API_KEY ?? ""}`;
        const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}`;

        const response = await fetch(`${baseURL}/chat/voice/to/text?brain_id=${currentBrain?.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        if (!data) {
          throw new Error("服务器返回空响应");
        }

        let processedData = data;
        if (processedData.startsWith('"') && processedData.endsWith('"')) {
          processedData = processedData.slice(1, -1);
        }

        if (!processedData.trim()) {
          throw new Error("语音转文字结果为空");
        }

        setMessage(processedData);

        // 直接提交问题
        if (processedData.trim() !== "" && remainingCredits && currentBrain) {
          handleSubmitQuestion(processedData);
        }
      } catch (error) {
        console.error("Error transcribing audio:", error);
        let errorMessage = "语音转文字结果为空";
        if (error instanceof Error) {
          if (error.message.includes("HTTP error")) {
            errorMessage = "服务器响应错误";
          } else if (error.message.includes("空响应")) {
            errorMessage = "服务器未返回有效结果";
          }
        }
        publish({
          variant: "danger",
          text: errorMessage,
        });
      }
    }
    setIsRecording(false);
  };

  return (
    <>
      <form
        data-testid="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitQuestion();
        }}
      >
        <div className={styles.chat_container}>
          <div className={styles.left_container}>
            {/*截图区域*/}
            {previewImage && (
              <div className={styles.preview_container}>
                <img src={previewImage} alt="预览" className={styles.preview_image} />
                <button
                  type="button"
                  onClick={removePreview}
                  className={styles.remove_preview}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {/*输入框上方的知识库*/}
            <CurrentBrain
              allowingRemoveBrain={false}
              remainingCredits={remainingCredits}
            />
          </div>
          <div
            className={`${styles.chat_wrapper} ${
              !remainingCredits ? styles.disabled : ""
            }`}
            onPaste={handlePaste}
          >
            <ChatEditor
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmitQuestion}
            />
            {generatingAnswer ? (
              <LoaderIcon size="large" color="accent" />
            ) : (
              <Icon
                name="followUp"
                size="large"
                color="accent"
                disabled={!message || !remainingCredits || !currentBrain}
                handleHover={true}
                onClick={handleSubmitQuestion}
              />
            )}
            {/*<button*/}
            {/*  className={`${styles.voice_button} ${!remainingCredits ? styles.disabled : ""}`}*/}
            {/*  disabled={!remainingCredits || !currentBrain || isProcessingImage}*/}
            {/*  type="button"*/}
            {/*  title="支持粘贴图片进行识别"*/}
            {/*>*/}
            {/*  <ImageIcon className="w-5 h-5" />*/}
            {/*</button>*/}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${styles.voice_button} ${isRecording ? styles.recording : ""} ${!remainingCredits ? styles.disabled : ""}`}
              disabled={!remainingCredits || !currentBrain}
            >
              {isRecording ? (
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                </div>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
