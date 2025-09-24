import React, { createContext, useState, useContext, ReactNode } from "react"

export interface TodoTask {
  id: string | number
  text: string
  type?: "reading" | "video" | "task" | string
  completed?: boolean
}

interface TodoContextType {
  tasks: TodoTask[]
  addTask: (task: Omit<TodoTask, "id">) => void
  removeTask: (id: string | number) => void
  toggleTask: (id: string | number) => void
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function useTodoContext() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error("useTodoContext must be used within a TodoProvider")
  return ctx
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TodoTask[]>([
    // Example default tasks
    { id: 1, text: "Complete Science Quiz 4", type: "task", completed: false },
    { id: 2, text: "Read English Chapter 3", type: "reading", completed: false },
    { id: 3, text: "Watch: Fractions in Maths", type: "video", completed: false },
  ])

  function addTask(task: Omit<TodoTask, "id">) {
    setTasks((prev) => [
      ...prev,
      { ...task, id: Date.now() },
    ])
  }

  function removeTask(id: string | number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function toggleTask(id: string | number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    )
  }

  return (
    <TodoContext.Provider value={{ tasks, addTask, removeTask, toggleTask }}>
      {children}
    </TodoContext.Provider>
  )
}
