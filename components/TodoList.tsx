"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Todo = {
  id: number
  text: string
  done: boolean
  userId: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState("")

  const userId = typeof window !== "undefined" ? window.localStorage.getItem("firebaseUid") || "demo" : "demo"

  const completedCount = todos.filter((todo) => todo.done).length
  const totalCount = todos.length

  async function fetchTodos() {
    setIsFetching(true)
    setError("")
    try {
      const res = await fetch(`/api/todos?userId=${userId}`)
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch todos.")
      }
      setTodos(data.todos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos.")
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addTodo() {
    if (!input.trim()) return
    setIsMutating(true)
    setError("")
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add todo.")
      }
      setTodos((prev) => [...prev, data.todo])
      setInput("")
      inputRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo.")
    } finally {
      setIsMutating(false)
    }
  }

  async function toggleTodo(id: number, done: boolean) {
    setIsMutating(true)
    setError("")
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !done, userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update todo.")
      }
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !done } : todo)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo.")
    } finally {
      setIsMutating(false)
    }
  }

  async function removeTodo(id: number) {
    setIsMutating(true)
    setError("")
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to remove todo.")
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove todo.")
    } finally {
      setIsMutating(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    addTodo()
  }

  return (
    <Card className="w-full border border-border/60 bg-card shadow-lg">

      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-balance text-3xl">My Tasks</CardTitle>
            <CardDescription className="text-pretty">
              Organize today&apos;s priorities and celebrate small wins along the way.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {completedCount} completed
            </Badge>
            <Badge variant="outline" className="border-border/80 text-muted-foreground">
              {totalCount} total
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Task Form */}
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center" noValidate>
          <Input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
            disabled={isMutating}
            className="flex-1 bg-secondary/60 border-border focus-visible:ring-primary"
          />
          <Button
            type="submit"
            className="sm:w-auto w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isMutating || !input.trim()}
          >
            {isMutating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add task
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isFetching ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p>Loading your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/40 px-6 py-10 text-center">
            <p className="text-lg font-medium text-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground">Add your first task to kick-start a productive day.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-200",
                  todo.done ? "border-chart-2/40 bg-chart-2/15" : "border-border bg-secondary/40 hover:bg-secondary/50",
                )}
              >
                <Checkbox
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(todo.id, todo.done)}
                  disabled={isMutating}
                  aria-label={todo.done ? "Mark task as incomplete" : "Mark task as complete"}
                />
                <span
                  className={cn(
                    "flex-1 text-left text-base font-medium text-foreground",
                    todo.done && "text-muted-foreground line-through",
                  )}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTodo(todo.id)}
                  disabled={isMutating}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
