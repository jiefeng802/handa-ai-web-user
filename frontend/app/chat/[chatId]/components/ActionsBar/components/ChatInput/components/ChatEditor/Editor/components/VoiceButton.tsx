import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export const VoiceButton = ({ onTranscription }: { onTranscription: (text: string) => void }) => {
  const { t } = useTranslation(["chat"]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        onTranscription(data.text);
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    }
    setIsRecording(false);
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      // title={isRecording ? t("stop_recording") : t("start_recording")}
    >
      {isRecording ? (
        <MicOff className="w-5 h-5 text-red-500" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}; 