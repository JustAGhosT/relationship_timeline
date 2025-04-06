"use client"

import { useState } from "react"
import type { TimelineEvent } from "@/lib/musk-career-data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  personalEvents: TimelineEvent[]
  careerEvents: TimelineEvent[]
}

export default function TimelineView({ personalEvents, careerEvents }: TimelineViewProps) {
  const [activeTab, setActiveTab] = useState<string>("personal")

  // Format date as Month DD, YYYY (e.g., January 1, 2020)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Sort events by date
  const sortedPersonalEvents = [...personalEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
  const sortedCareerEvents = [...careerEvents].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="w-full">
      <Tabs defaultValue="personal" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Life</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <div className="space-y-8">
            {sortedPersonalEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline connector */}
                {index < sortedPersonalEvents.length - 1 && (
                  <div className="absolute left-[19px] top-[40px] bottom-[-24px] w-[2px] bg-gray-200" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="mt-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {event.date.getFullYear().toString().substring(2)}
                  </div>

                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 w-fit">
                        {event.category}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="career" className="mt-6">
          <div className="space-y-8">
            {sortedCareerEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline connector */}
                {index < sortedCareerEvents.length - 1 && (
                  <div className="absolute left-[19px] top-[40px] bottom-[-24px] w-[2px] bg-gray-200" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "mt-2 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold",
                      event.category === "Company"
                        ? "bg-blue-600"
                        : event.category === "SpaceX"
                          ? "bg-purple-600"
                          : event.category === "Tesla"
                            ? "bg-red-600"
                            : event.category === "Acquisition"
                              ? "bg-green-600"
                              : event.category === "Exit"
                                ? "bg-yellow-600"
                                : "bg-gray-600",
                    )}
                  >
                    {event.date.getFullYear().toString().substring(2)}
                  </div>

                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
                      </div>
                      <div
                        className={cn(
                          "text-xs rounded-full px-2 py-1 w-fit",
                          event.category === "Company"
                            ? "bg-blue-100 text-blue-800"
                            : event.category === "SpaceX"
                              ? "bg-purple-100 text-purple-800"
                              : event.category === "Tesla"
                                ? "bg-red-100 text-red-800"
                                : event.category === "Acquisition"
                                  ? "bg-green-100 text-green-800"
                                  : event.category === "Exit"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {event.category}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

