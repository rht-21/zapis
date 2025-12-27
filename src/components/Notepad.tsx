import React, { useRef, useEffect } from "react";
import { saveSecurely, loadSecurely } from "../lib/storage";

const Notepad: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      const savedContent = await loadSecurely();
      if (editorRef.current) {
        if (savedContent) {
          editorRef.current.innerHTML = savedContent;
        } else {
          // Default content
          editorRef.current.innerHTML = "<p>Hi, it feels lonely here...</p>";
        }
      }
    };
    init();
  }, []);

  const handleInput = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        saveSecurely(editorRef.current.innerHTML);
      }
    }, 1000);
  };

  return (
    <section className="w-2/3 h-full overflow-auto border-r border-primary/30 relative">
      <span className="absolute top-0 left-0 bg-primary text-secondary-foreground rounded-br-xl w-14 uppercase font-medium tracking-wide text-sm flex items-center justify-center pr-1 py-1">
        Note
      </span>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="px-12 py-16 outline-none min-h-full font-sans text-base"
      />
    </section>
  );
};

export default Notepad;
