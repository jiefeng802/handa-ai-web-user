import { EditorContent } from "@tiptap/react";
import { useCreateEditorState } from "./hooks/useCreateEditorState";
import { VoiceButton } from "./components/VoiceButton";

export const Editor = ({ placeholder }: { placeholder?: string }) => {
  const { editor } = useCreateEditorState(placeholder);

  const handleTranscription = (text: string) => {
    if (editor) {
      editor.commands.insertContent(text);
    }
  };

  return (
    <div className="flex items-center w-full">
      <EditorContent editor={editor} className="flex-1" />
      <VoiceButton onTranscription={handleTranscription} />
    </div>
  );
}; 