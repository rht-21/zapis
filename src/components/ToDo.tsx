import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { loadSecurely, saveSecurely } from "../lib/storage";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: number;
}

const STORAGE_KEY = "zapis-todos";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const ToDo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const addTodo = () => {
    if (!inputValue.trim()) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    saveTodosToStorage(newTodos);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        const isCompleted = !todo.completed;
        return {
          ...todo,
          completed: isCompleted,
          completedAt: isCompleted ? Date.now() : undefined,
        };
      }
      return todo;
    });
    setTodos(newTodos);
    saveTodosToStorage(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodosToStorage(newTodos);
  };

  // Sort todos: active first, then completed
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <section className="w-1/3 h-full flex flex-col border-primary/30 relative bg-background">
      <span className="absolute top-0 right-0 bg-primary text-secondary-foreground rounded-bl-xl w-14 pl-1 py-1 uppercase font-medium tracking-wide text-sm flex items-center justify-center z-10">
        ToDo
      </span>

      <div className="px-4 py-6 pt-10 border-b border-primary/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="w-full bg-secondary/50 rounded-lg pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <p>No tasks yet.</p>
            <p className="text-sm opacity-60">Add one above to get started!</p>
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                todo.completed
                  ? "bg-secondary/30 border-transparent opacity-60"
                  : "bg-card border-border hover:border-primary/30 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/40 hover:border-primary"
                }`}
              >
                {todo.completed && <Check size={12} strokeWidth={3} />}
              </button>

              <span
                className={`flex-1 text-sm break-all ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                aria-label="Delete todo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ToDo;
