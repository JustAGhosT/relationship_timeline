"use client"

import TimelineView from "@/components/timeline-view"
import { personalEvents } from "@/lib/musk-personal-data"
import { careerEvents } from "@/lib/musk-career-data"

export default function TimelinePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Elon Musk Timeline</h1>
      <p className="text-center text-muted-foreground mb-8">A chronological view of Elon Musk's life and career</p>

      <TimelineView personalEvents={personalEvents} careerEvents={careerEvents} />
    </div>
  )
}

