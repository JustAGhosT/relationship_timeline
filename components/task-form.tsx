"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  onAddTask: (task: Task) => void
  existingTasks: Task[]
}

export default function TaskForm({ onAddTask, existingTasks }: TaskFormProps) {
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [progress, setProgress] = useState("0")
  const [dependencies, setDependencies] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !startDate || !endDate) return

    const newTask: Task = {
      id: "", // Will be set by parent component
      name,
      start: new Date(startDate),
      end: new Date(endDate),
      progress: Number.parseInt(progress),
      type: "task",
      dependencies,
    }

    onAddTask(newTask)

    // Reset form
    setName("")
    setStartDate("")
    setEndDate("")
    setProgress("0")
    setDependencies([])
  }

  const handleDependencyChange = (taskId: string) => {
    setDependencies((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Task Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter task name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            required
          />
        </div>

        {existingTasks.length > 0 && (
          <div className="space-y-2">
            <Label>Dependencies</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {existingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={`dep-${task.id}`}
                    checked={dependencies.includes(task.id)}
                    onChange={() => handleDependencyChange(task.id)}
                    className="rounded"
                  />
                  <label htmlFor={`dep-${task.id}`} className="text-sm">
                    {task.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </div>
  )
}

