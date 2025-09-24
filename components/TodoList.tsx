import React, { useEffect, useState } from "react";

type Todo = { id: number; text: string; done: boolean; userId: string };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("firebaseUid") || "demo"
      : "demo";

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch(`/api/todos?userId=${userId}`);
      const data = await res.json();
      if (data.success) setTodos(data.todos);
      else setError(data.message);
    } catch {
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => [...prev, data.todo]);
        setInput("");
        inputRef.current?.focus();
      } else setError(data.message);
    } catch {
      setError("Failed to add todo.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(id: number, done: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !done, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, done: !done } : t))
        );
      } else setError(data.message);
    } catch {
      setError("Failed to update todo.");
    } finally {
      setLoading(false);
    }
  }

  async function removeTodo(id: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } else setError(data.message);
    } catch {
      setError("Failed to remove todo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-6 bg-gradient-to-br from-purple-700 via-teal-700 to-blue-800 rounded-3xl shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        My Tasks
      </h2>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-400 focus:outline-none"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          onClick={addTodo}
          disabled={loading || !input.trim()}
        >
          Add
        </button>
      </div>

      {error && <div className="text-red-400 mb-2">{error}</div>}

      {/* Todo List */}
      <div className="flex flex-wrap gap-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border min-w-[180px] max-w-xs flex-1 ${
              todo.done
                ? "bg-green-700/40 border-green-400"
                : "bg-gray-800/40 border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id, todo.done)}
            />
            <span className={todo.done ? "line-through text-gray-200" : "text-white"}>
              {todo.text}
            </span>
            <button
              className="ml-auto text-red-400 hover:text-red-600 font-bold"
              onClick={() => removeTodo(todo.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {loading && <div className="text-white mt-2">Loading...</div>}
    </div>
  );
}
