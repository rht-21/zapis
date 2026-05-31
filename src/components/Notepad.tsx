import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { saveSecurely, loadSecurely } from "../lib/storage";

const Notepad = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Start writing… type '#', '-', or '- [ ]' for markdown",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap px-12 py-16 outline-none min-h-full h-full overflow-auto font-sans text-base",
      },
    },
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveSecurely(editor.getHTML());
      }, 1000);
    },
  });

  // Load any previously saved (encrypted HTML) content once the editor is ready.
  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    const init = async () => {
      const savedContent = await loadSecurely();
      if (cancelled || !savedContent) return;
      // Avoid pushing a redundant update onto the undo stack.
      editor.commands.setContent(savedContent, { emitUpdate: false });
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [editor]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="w-2/3 h-full overflow-hidden glass-panel rounded-2xl relative">
      <span className="absolute top-0 left-0 z-10 bg-linear-to-br from-primary to-accent text-primary-foreground rounded-br-2xl rounded-tl-2xl px-4 py-1.5 uppercase font-semibold tracking-wide text-xs flex items-center justify-center shadow-lg">
        Note
      </span>
      <EditorContent editor={editor} className="h-full overflow-auto" />
    </section>
  );
};

export default Notepad;
