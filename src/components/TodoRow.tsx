import { useEffect, useRef, useState } from "react";
import { Trash2, Check, GripVertical, Pencil } from "lucide-react";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: number;
}

interface TodoRowProps {
  todo: TodoItem;
  isDragging: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, text: string) => void;
  onDragStart: (id: string) => void;
  onDragEnterRow: (id: string) => void;
  onDragEnd: () => void;
}

const TodoRow = ({
  todo,
  isDragging,
  onToggle,
  onDelete,
  onSaveEdit,
  onDragStart,
  onDragEnterRow,
  onDragEnd,
}: TodoRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraft(todo.text);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) {
      onSaveEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={() => onDragStart(todo.id)}
      onDragEnter={() => onDragEnterRow(todo.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? "bg-white/10 dark:bg-white/5 border-transparent opacity-60"
          : "bg-white/30 dark:bg-white/5 backdrop-blur-sm border-white/30 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40"
      } ${isDragging ? "opacity-40 ring-2 ring-primary/60" : ""}`}
    >
      <span
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <GripVertical size={16} />
      </span>

      <button
        onClick={() => onToggle(todo.id)}
        disabled={isEditing}
        className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
          todo.completed
            ? "bg-linear-to-br from-primary to-accent border-transparent text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {todo.completed && <Check size={12} strokeWidth={3} />}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={commitEdit}
          className="flex-1 min-w-0 text-sm bg-white/40 dark:bg-white/10 border border-primary/40 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary/40"
        />
      ) : (
        <span
          onDoubleClick={startEditing}
          className={`flex-1 text-sm break-all cursor-text ${
            todo.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {todo.text}
        </span>
      )}

      {!isEditing && (
        <button
          onClick={startEditing}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
          aria-label="Edit todo"
        >
          <Pencil size={15} />
        </button>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
        aria-label="Delete todo"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TodoRow;
