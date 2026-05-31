import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import { loadSecurely, saveSecurely } from "../lib/storage";
import TodoRow, { type TodoItem } from "./TodoRow";

const STORAGE_KEY = "zapis-todos";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const ToDo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadTodos = async () => {
      try {
        const saved = await loadSecurely(STORAGE_KEY);
        if (saved) {
          const parsedTodos: TodoItem[] = JSON.parse(saved);
          const now = Date.now();

          // Filter out tasks completed more than 1 day ago
          const activeTodos = parsedTodos.filter((todo) => {
            if (!todo.completed || !todo.completedAt) return true;
            return now - todo.completedAt < ONE_DAY_MS;
          });

          // If we filtered out any tasks, save the updated list
          if (activeTodos.length !== parsedTodos.length) {
            saveTodosToStorage(activeTodos);
          }

          setTodos(activeTodos);
        }
      } catch (error) {
        console.error("Failed to load todos", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, []);

  const saveTodosToStorage = (newTodos: TodoItem[]) => {
    saveSecurely(JSON.stringify(newTodos), STORAGE_KEY);
  };

  const commitTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
    saveTodosToStorage(newTodos);
  };

  const addTodo = () => {
    if (!inputValue.trim()) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    commitTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    commitTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const isCompleted = !todo.completed;
          return {
            ...todo,
            completed: isCompleted,
            completedAt: isCompleted ? Date.now() : undefined,
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    commitTodos(todos.filter((todo) => todo.id !== id));
  };

  const saveEdit = (id: string, text: string) => {
    commitTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  // Drag-and-drop reordering: reorder live as the dragged row enters another row.
  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDragEnterRow = (overId: string) => {
    if (!draggingId || draggingId === overId) return;

    const fromIndex = todos.findIndex((t) => t.id === draggingId);
    const toIndex = todos.findIndex((t) => t.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...todos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setTodos(reordered);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    saveTodosToStorage(todos);
  };

  return (
    <section className="w-1/3 h-full flex flex-col glass-panel rounded-2xl relative">
      <span className="absolute top-0 right-0 z-10 bg-linear-to-bl from-secondary to-primary text-secondary-foreground rounded-bl-2xl rounded-tr-2xl px-4 py-1.5 uppercase font-semibold tracking-wide text-xs flex items-center justify-center shadow-lg">
        ToDo
      </span>

      <div className="px-4 py-6 pt-12 border-b border-white/20 dark:border-white/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="w-full bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/70"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="absolute right-2 p-1.5 bg-linear-to-br from-primary to-accent text-primary-foreground rounded-lg shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6 space-y-2">
        {isLoading ? (
          <div className="text-center text-muted-foreground mt-10">
            Loading...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10 flex flex-col items-center gap-2">
            <p className="animate-pulse">No tasks yet.</p>
            <p className="text-sm opacity-60">Add one above to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              isDragging={draggingId === todo.id}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onSaveEdit={saveEdit}
              onDragStart={handleDragStart}
              onDragEnterRow={handleDragEnterRow}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ToDo;
