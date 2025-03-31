"use client"

import { useEffect, useRef, useState } from "react"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GanttChartProps {
  tasks: Task[]
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  // Calculate the earliest start date and latest end date from tasks
  useEffect(() => {
    if (tasks.length === 0) return

    const earliestStart = new Date(Math.min(...tasks.map((task) => task.start.getTime())))
    const latestEnd = new Date(Math.max(...tasks.map((task) => task.end.getTime())))

    // Add some padding
    earliestStart.setDate(earliestStart.getDate() - 7)
    latestEnd.setDate(latestEnd.getDate() + 7)

    setStartDate(earliestStart)
    setEndDate(latestEnd)
  }, [tasks])

  // Generate date headers based on view mode
  const generateDateHeaders = () => {
    const headers = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      let label = ""

      if (viewMode === "day") {
        label = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else if (viewMode === "week") {
        label = `Week ${getWeekNumber(currentDate)}`
      } else {
        label = currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      }

      headers.push({
        date: new Date(currentDate),
        label,
      })

      if (viewMode === "day") {
        currentDate.setDate(currentDate.getDate() + 1)
      } else if (viewMode === "week") {
        currentDate.setDate(currentDate.getDate() + 7)
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }

    return headers
  }

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Calculate task position and width
  const getTaskStyle = (task: Task) => {
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const taskStartDays = (task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)

    const left = (taskStartDays / totalDays) * 100
    const width = (taskDuration / totalDays) * 100

    return {
      left: `${left}%`,
      width: `${width}%`,
    }
  }

  const dateHeaders = generateDateHeaders()

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Project Timeline</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("day")}
            className={cn("px-3 py-1 rounded text-sm", viewMode === "day" ? "bg-primary text-white" : "bg-gray-200")}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={cn("px-3 py-1 rounded text-sm", viewMode === "week" ? "bg-primary text-white" : "bg-gray-200")}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={cn("px-3 py-1 rounded text-sm", viewMode === "month" ? "bg-primary text-white" : "bg-gray-200")}
          >
            Month
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Date headers */}
          <div className="flex border-b">
            <div className="w-1/4 min-w-[200px] p-2 font-medium">Task</div>
            <div className="w-3/4 flex">
              {dateHeaders.map((header, index) => (
                <div key={index} className="flex-1 p-2 text-center text-sm border-l">
                  {header.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="relative">
            {tasks.map((task, index) => (
              <div key={task.id} className="flex border-b hover:bg-gray-50">
                <div className="w-1/4 min-w-[200px] p-3 font-medium">{task.name}</div>
                <div className="w-3/4 relative h-12">
                  <div
                    className="absolute top-2 h-8 bg-primary rounded-md opacity-80 hover:opacity-100 transition-opacity"
                    style={getTaskStyle(task)}
                  >
                    <div className="h-full flex items-center justify-center px-2 text-white text-xs overflow-hidden">
                      {task.progress}%
                    </div>
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-l-md"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

