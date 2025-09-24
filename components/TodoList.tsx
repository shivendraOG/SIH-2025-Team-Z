"use client"

import type React from "react"
import { useEffect, useRef, useState, useContext } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TodoContext } from "@/context/TodoContext"
import { Plus, Trash2 } from "lucide-react"
import clsx from "clsx" // or 'classnames' or your own 'cn' utility

// We'll use the TodoTask type from context/TodoContext

export default function TodoList() {
  const { tasks, addTask, removeTask, toggleTask } = useContext(TodoContext) || { tasks: [], addTask: () => {}, removeTask: () => {}, toggleTask: () => {} }
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const completedCount = tasks.filter((todo) => todo.completed).length
  const totalCount = tasks.length

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!input.trim()) return
    addTask({ text: input, completed: false }) // id will be handled internally
    setInput("")
    inputRef.current?.focus()
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          noValidate
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
            className="flex-1 bg-secondary/60 border-border focus-visible:ring-primary"
          />
          <Button
            type="submit"
            className="sm:w-auto w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!input.trim()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add task
          </Button>
        </form>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/40 px-6 py-10 text-center">
            <p className="text-lg font-medium text-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first task to kick-start a productive day.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((todo) => (
              <div
                key={todo.id}
                className={clsx(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-200",
                  todo.completed
                    ? "border-chart-2/40 bg-chart-2/15"
                    : "border-border bg-secondary/40 hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTask(todo.id)}
                  aria-label={
                    todo.completed
                      ? "Mark task as incomplete"
                      : "Mark task as complete"
                  }
                />
                <span
                  className={clsx(
                    "flex-1 text-left text-base font-medium text-foreground",
                    todo.completed && "text-muted-foreground line-through"
                  )}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(todo.id)}
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
