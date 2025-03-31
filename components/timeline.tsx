"use client"

import { useEffect, useRef, useState } from "react"
import type { AnalysisOptions, Relationship } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ExternalLink, ZoomIn, ZoomOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add a debounce utility to prevent rapid resize events
// Add this near the top of the file, after the imports
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

// Add a Legend component at the top of the file, after the imports
const TimelineLegend = () => {
  return (
    <div className="bg-white p-4 rounded-md border mb-4">
      <h3 className="text-sm font-medium mb-3">Legend</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-12 h-6 bg-primary rounded-md"></div>
          <span className="text-sm">Relationship Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary rounded-full bg-white"></div>
          <span className="text-sm">Child Conception</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-full"></div>
          <span className="text-sm">Child Birth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-6 bg-red-500/30 border border-red-500 rounded-md"></div>
          <span className="text-sm">Overlapping Relationships</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary rounded-full bg-white ring-2 ring-red-500 ring-offset-1"></div>
          <span className="text-sm">Out-of-Range Conception</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full border border-gray-300"></div>
          <span className="text-sm">Relationship Highlight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-yellow-500 rounded-full bg-white ring-2 ring-blue-500 ring-offset-1"></div>
          <span className="text-sm">Cross-Relationship Child</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full border-2 border-primary text-xs font-bold">
            3
          </div>
          <span className="text-sm">Number of Children</span>
        </div>
      </div>
    </div>
  )
}

// Add a function to detect cross-relationship children (conceived in one, born in another)
const findCrossRelationshipChildren = (relationships: Relationship[]) => {
  const crossRelationshipChildren: {
    childId: string
    conceptionRelationshipId: string
    birthRelationshipId: string
  }[] = []

  // For each child in each relationship
  relationships.forEach((birthRelationship) => {
    birthRelationship.children.forEach((child) => {
      // Check if the child was conceived in a different relationship
      relationships.forEach((conceptionRelationship) => {
        if (
          conceptionRelationship.id !== birthRelationship.id &&
          child.conceptionDate >= conceptionRelationship.startDate &&
          child.conceptionDate <= conceptionRelationship.endDate
        ) {
          crossRelationshipChildren.push({
            childId: child.id,
            conceptionRelationshipId: conceptionRelationship.id,
            birthRelationshipId: birthRelationship.id,
          })
        }
      })
    })
  })

  return crossRelationshipChildren
}

// Modify the isChildOutOfRange function to also check for cross-relationship children
const isChildOutOfRange = (
  relationshipId: string,
  childId: string,
  outOfRangeConceptions: { relationshipId: string; childId: string }[],
  crossRelationshipChildren: { childId: string; conceptionRelationshipId: string; birthRelationshipId: string }[],
) => {
  return (
    outOfRangeConceptions.some((item) => item.relationshipId === relationshipId && item.childId === childId) ||
    crossRelationshipChildren.some(
      (item) =>
        (item.birthRelationshipId === relationshipId || item.conceptionRelationshipId === relationshipId) &&
        item.childId === childId,
    )
  )
}

// Add the crossRelationshipChildren parameter to the Timeline component props
interface TimelineProps {
  relationships: Relationship[]
  onSelectRelationship: (relationship: Relationship | null) => void
  selectedRelationship: Relationship | null
  analysisOptions: AnalysisOptions
  overlappingRelationships: { id1: string; id2: string; startDate: Date; endDate: Date }[]
  outOfRangeConceptions: { relationshipId: string; childId: string }[]
  crossRelationshipChildren?: {
    childId: string
    relationshipId: string
    conceptionRelationshipId: string
    relationshipName: string
  }[]
}

// Update the Timeline component to include the legend and cross-relationship detection
export default function Timeline({
  relationships,
  onSelectRelationship,
  selectedRelationship,
  analysisOptions,
  overlappingRelationships,
  outOfRangeConceptions,
  crossRelationshipChildren = [],
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [hoveredRelationship, setHoveredRelationship] = useState<string | null>(null)

  // Remove this calculation since we're now passing crossRelationshipChildren as a prop
  // const crossRelationshipChildren = analysisOptions.enabled ? findCrossRelationshipChildren(relationships) : [];

  // Find earliest and latest dates
  const earliestDate =
    relationships.length > 0
      ? new Date(Math.min(...relationships.map((r) => r.startDate.getTime())))
      : new Date(new Date().getFullYear() - 5, 0, 1)

  const latestDate =
    relationships.length > 0 ? new Date(Math.max(...relationships.map((r) => r.endDate.getTime()))) : new Date()

  // Add padding to dates (6 months before and after)
  const paddedEarliestDate = new Date(earliestDate)
  paddedEarliestDate.setMonth(paddedEarliestDate.getMonth() - 6)

  const paddedLatestDate = new Date(latestDate)
  paddedLatestDate.setMonth(paddedLatestDate.getMonth() + 6)

  // Calculate total timeline duration in days
  const totalDays = (paddedLatestDate.getTime() - paddedEarliestDate.getTime()) / (1000 * 60 * 60 * 24)

  // Generate year markers
  const generateYearMarkers = () => {
    const markers = []
    const startYear = paddedEarliestDate.getFullYear()
    const endYear = paddedLatestDate.getFullYear()

    for (let year = startYear; year <= endYear; year++) {
      const date = new Date(year, 0, 1)
      if (date >= paddedEarliestDate && date <= paddedLatestDate) {
        const position = getPositionForDate(date)
        markers.push({ year, position })
      }
    }

    return markers
  }

  // Calculate position percentage for a date
  const getPositionForDate = (date: Date) => {
    const daysSinceStart = (date.getTime() - paddedEarliestDate.getTime()) / (1000 * 60 * 60 * 24)
    return (daysSinceStart / totalDays) * 100
  }

  // Calculate width percentage for a relationship
  const getWidthForRelationship = (relationship: Relationship) => {
    const durationDays = (relationship.endDate.getTime() - relationship.startDate.getTime()) / (1000 * 60 * 60 * 24)
    return (durationDays / totalDays) * 100
  }

  // Handle zoom in/out
  const handleZoomIn = () => {
    window.requestAnimationFrame(() => {
      setZoomLevel((prev) => Math.min(prev + 0.5, 3))
    })
  }

  const handleZoomOut = () => {
    window.requestAnimationFrame(() => {
      setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
    })
  }

  // Handle scroll left/right
  const handleScrollLeft = () => {
    if (containerRef.current) {
      window.requestAnimationFrame(() => {
        containerRef.current!.scrollLeft -= 200
        setScrollPosition(containerRef.current!.scrollLeft)
      })
    }
  }

  const handleScrollRight = () => {
    if (containerRef.current) {
      window.requestAnimationFrame(() => {
        containerRef.current!.scrollLeft += 200
        setScrollPosition(containerRef.current!.scrollLeft)
      })
    }
  }

  // Update scroll position when container is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft)
      }
    }

    // Add error handling for ResizeObserver errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver") || event.error?.message?.includes("ResizeObserver")) {
        // Prevent the error from showing in console
        event.preventDefault()
        event.stopPropagation()
      }
    }

    // Debounced resize handler to prevent rapid layout shifts
    const handleResize = debounce(() => {
      if (containerRef.current) {
        // Force a single reflow/repaint cycle
        window.requestAnimationFrame(() => {
          // This empty callback ensures we wait for the next frame
        })
      }
    }, 100)

    window.addEventListener("error", handleError as any)
    window.addEventListener("resize", handleResize)

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)

      // Create a ResizeObserver with error handling
      try {
        const resizeObserver = new ResizeObserver(
          debounce((entries: ResizeObserverEntry[]) => {
            // Do nothing, just let the browser handle the resize
            // This prevents the error by acknowledging the resize
          }, 100),
        )

        resizeObserver.observe(container)

        return () => {
          container.removeEventListener("scroll", handleScroll)
          window.removeEventListener("error", handleError as any)
          window.removeEventListener("resize", handleResize)
          resizeObserver.disconnect()
        }
      } catch (e) {
        console.warn("ResizeObserver not supported in this browser")
      }
    }

    return () => {
      window.removeEventListener("error", handleError as any)
      window.removeEventListener("resize", handleResize)
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const yearMarkers = generateYearMarkers()

  // Format date as MMM YYYY (e.g., Jan 2020)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Calculate timeline height based on number of relationships and analysis row
  // Each relationship gets its own row, plus optional analysis row
  const timelineHeight = relationships.length * 80 + (analysisOptions.enabled ? 80 : 0) + 40 // 80px per row + 40px padding

  // Check if a child is cross-relationship
  const isChildCrossRelationship = (childId: string) => {
    return crossRelationshipChildren.some((item) => item.childId === childId)
  }

  // Get the conception relationship for a cross-relationship child
  const getConceptionRelationship = (childId: string) => {
    const crossChild = crossRelationshipChildren.find((item) => item.childId === childId)
    if (crossChild) {
      return relationships.find((r) => r.id === crossChild.conceptionRelationshipId)
    }
    return null
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleScrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleScrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add the legend component */}
      {relationships.length > 0 && <TimelineLegend />}

      <div
        ref={containerRef}
        className="overflow-x-auto pb-4 border rounded-md bg-gray-50"
        style={{
          height: `${Math.max(timelineHeight + 50, 250)}px`,
          position: "relative",
        }}
      >
        <div
          className="relative"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: "800px",
            height: `${Math.max(timelineHeight, 200)}px`,
            minHeight: "200px",
          }}
        >
          {/* Year markers */}
          <div className="absolute top-0 left-0 w-full h-8 border-b bg-white">
            {yearMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 h-full border-l text-xs text-gray-500 flex items-end pb-1"
                style={{ left: `${marker.position}%` }}
              >
                {marker.year}
              </div>
            ))}
          </div>

          {/* Relationships */}
          <div className="absolute top-10 left-0 w-full">
            <TooltipProvider>
              {relationships.map((relationship, index) => {
                const left = getPositionForDate(relationship.startDate)
                const width = getWidthForRelationship(relationship)
                const top = index * 80 + 10 // Each relationship gets its own row, 80px apart with 10px padding

                return (
                  <Tooltip key={relationship.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute h-16 rounded-md cursor-pointer transition-all duration-300",
                          selectedRelationship?.id === relationship.id
                            ? "ring-2 ring-offset-2 z-10"
                            : hoveredRelationship === relationship.id
                              ? "opacity-90 shadow-lg z-10 scale-105 transform -translate-y-1"
                              : "hover:opacity-90 hover:shadow",
                        )}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          top: `${top}px`,
                          backgroundColor: relationship.color,
                        }}
                        onClick={() => onSelectRelationship(relationship)}
                        onMouseEnter={() => setHoveredRelationship(relationship.id)}
                        onMouseLeave={() => setHoveredRelationship(null)}
                      >
                        <div className="h-full flex items-center justify-center px-3 text-white text-sm font-medium overflow-hidden">
                          {relationship.name}
                          {relationship.moreInfoUrl && (
                            <a
                              href={relationship.moreInfoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 opacity-70 hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* Start date label */}
                        <div className="absolute -bottom-6 left-0 text-xs whitespace-nowrap">
                          {formatDate(relationship.startDate)}
                        </div>

                        {/* End date label */}
                        <div className="absolute -bottom-6 right-0 text-xs whitespace-nowrap">
                          {formatDate(relationship.endDate)}
                        </div>

                        {/* Children indicators */}
                        {relationship.children.length > 0 && (
                          <div
                            className="absolute -top-3 right-2 bg-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2"
                            style={{ borderColor: relationship.color }}
                          >
                            {relationship.children.length}
                          </div>
                        )}

                        {/* Child conception and birth markers */}
                        {relationship.children.map((child, childIndex) => {
                          // Conception marker
                          const conceptionPosition = getPositionForDate(child.conceptionDate)
                          const conceptionLeft = ((conceptionPosition - left) / width) * 100

                          // Birth marker
                          const birthPosition = getPositionForDate(child.birthDate)
                          const birthLeft = ((birthPosition - left) / width) * 100

                          const isOutOfRange = isChildOutOfRange(
                            relationship.id,
                            child.id,
                            outOfRangeConceptions,
                            crossRelationshipChildren,
                          )
                          const isCrossRelationship = isChildCrossRelationship(child.id)
                          const conceptionRelationship = isCrossRelationship
                            ? getConceptionRelationship(child.id)
                            : null

                          return (
                            <div key={child.id}>
                              {/* Conception marker (empty circle) */}
                              {conceptionLeft >= 0 && conceptionLeft <= 100 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute top-0 w-4 h-4 border-2 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2",
                                        isOutOfRange && analysisOptions.enabled
                                          ? "ring-2 ring-red-500 ring-offset-1"
                                          : "",
                                        isCrossRelationship && analysisOptions.enabled
                                          ? "ring-2 ring-blue-500 ring-offset-1 border-yellow-500"
                                          : "",
                                      )}
                                      style={{
                                        left: `${conceptionLeft}%`,
                                        borderColor:
                                          isCrossRelationship && conceptionRelationship
                                            ? conceptionRelationship.color
                                            : relationship.color,
                                      }}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="p-2 max-w-[300px]">
                                    <p className="font-medium">{child.name} - Conception</p>
                                    <p className="text-xs">{formatDate(child.conceptionDate)}</p>
                                    {isOutOfRange && analysisOptions.enabled && (
                                      <>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          Conceived outside relationship timeframe
                                        </p>
                                        <p className="text-xs mt-1 text-muted-foreground">
                                          This might indicate infidelity, data entry errors, or that this child is from
                                          a different relationship. Consider reviewing the dates or relationship
                                          assignment.
                                        </p>
                                      </>
                                    )}
                                    {isCrossRelationship && analysisOptions.enabled && conceptionRelationship && (
                                      <>
                                        <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          Conceived in a different relationship
                                        </p>
                                        <p className="text-xs mt-1">
                                          Conceived during:{" "}
                                          <span className="font-medium">{conceptionRelationship.name}</span>
                                        </p>
                                        <p className="text-xs mt-1 text-muted-foreground">
                                          This child was conceived during one relationship but is associated with
                                          another. This might indicate a complex relationship transition or data entry
                                          errors.
                                        </p>
                                      </>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Birth marker (filled circle) */}
                              {birthLeft >= 0 && birthLeft <= 100 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute bottom-0 w-4 h-4 rounded-full transform -translate-x-1/2 translate-y-1/2",
                                        isOutOfRange && analysisOptions.enabled
                                          ? "ring-2 ring-red-500 ring-offset-1"
                                          : "",
                                        isCrossRelationship && analysisOptions.enabled
                                          ? "ring-2 ring-blue-500 ring-offset-1"
                                          : "",
                                      )}
                                      style={{
                                        left: `${birthLeft}%`,
                                        backgroundColor: relationship.color,
                                      }}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" className="p-2 max-w-[300px]">
                                    <p className="font-medium">{child.name} - Birth</p>
                                    <p className="text-xs">{formatDate(child.birthDate)}</p>
                                    {isOutOfRange && analysisOptions.enabled && (
                                      <>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          Conceived outside relationship timeframe
                                        </p>
                                        <p className="text-xs mt-1 text-muted-foreground">
                                          This might indicate infidelity, data entry errors, or that this child is from
                                          a different relationship. Consider reviewing the dates or relationship
                                          assignment.
                                        </p>
                                      </>
                                    )}
                                    {isCrossRelationship && analysisOptions.enabled && conceptionRelationship && (
                                      <>
                                        <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          Conceived in a different relationship
                                        </p>
                                        <p className="text-xs mt-1">
                                          Conceived during:{" "}
                                          <span className="font-medium">{conceptionRelationship.name}</span>
                                        </p>
                                        <p className="text-xs mt-1 text-muted-foreground">
                                          This child was conceived during one relationship but is associated with
                                          another. This might indicate a complex relationship transition or data entry
                                          errors.
                                        </p>
                                      </>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          )
                        })}

                        {/* Highlight markers */}
                        {relationship.highlights.map((highlight, hIndex) => {
                          const highlightPosition =
                            ((highlight.date.getTime() - relationship.startDate.getTime()) /
                              (relationship.endDate.getTime() - relationship.startDate.getTime())) *
                            100

                          return (
                            <Tooltip key={hIndex}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute bottom-0 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2 border border-gray-300"
                                  style={{ left: `${highlightPosition}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="p-2">
                                <p className="font-medium">{highlight.title}</p>
                                <p className="text-xs">{formatDate(highlight.date)}</p>
                                <p className="text-xs mt-1">{highlight.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-0 overflow-hidden max-w-xs">
                      <div className="p-3">
                        <div className="font-bold text-base mb-1">{relationship.name}</div>
                        <div className="text-sm mb-2">
                          {formatDate(relationship.startDate)} - {formatDate(relationship.endDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {relationship.details.substring(0, 100)}
                          {relationship.details.length > 100 ? "..." : ""}
                        </div>
                        {relationship.children.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="font-medium text-sm">Children: {relationship.children.length}</div>
                            <ul className="mt-1 text-xs space-y-1">
                              {relationship.children.map((child) => {
                                const isOutOfRange = isChildOutOfRange(
                                  relationship.id,
                                  child.id,
                                  outOfRangeConceptions,
                                  crossRelationshipChildren,
                                )
                                const isCrossRelationship = isChildCrossRelationship(child.id)

                                return (
                                  <li
                                    key={child.id}
                                    className={cn(
                                      isOutOfRange && !isCrossRelationship && analysisOptions.enabled
                                        ? "text-red-500"
                                        : "",
                                      isCrossRelationship && analysisOptions.enabled ? "text-blue-500" : "",
                                    )}
                                  >
                                    {child.name} (Born: {formatDate(child.birthDate)})
                                    {isOutOfRange && !isCrossRelationship && analysisOptions.enabled && (
                                      <span className="ml-1">⚠️</span>
                                    )}
                                    {isCrossRelationship && analysisOptions.enabled && <span className="ml-1">🔄</span>}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                        {relationship.moreInfoUrl && (
                          <div className="mt-2 pt-2 border-t">
                            <a
                              href={relationship.moreInfoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              More information
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="h-1" style={{ backgroundColor: relationship.color }}></div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}

              {/* Analysis row for overlapping relationships */}
              {analysisOptions.enabled && (
                <div className="absolute left-0 w-full" style={{ top: `${relationships.length * 80 + 10}px` }}>
                  <div className="h-16 w-full relative">
                    <div className="absolute left-0 top-0 h-full w-full flex items-center px-4 text-sm text-muted-foreground">
                      Analysis
                    </div>

                    {/* Overlap indicators */}
                    {analysisOptions.showUnfaithfulPeriods &&
                      overlappingRelationships.map((overlap, index) => {
                        const left = getPositionForDate(overlap.startDate)
                        const width =
                          ((overlap.endDate.getTime() - overlap.startDate.getTime()) /
                            (1000 * 60 * 60 * 24) /
                            totalDays) *
                          100

                        return (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div
                                className="absolute h-8 bg-red-500/30 border border-red-500 rounded-md"
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                  top: "4px",
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="p-2 max-w-[300px]">
                              <p className="font-medium text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Overlapping Relationships
                              </p>
                              <p className="text-xs mt-1">
                                {formatDate(overlap.startDate)} - {formatDate(overlap.endDate)}
                              </p>
                              <p className="text-xs mt-1">
                                Relationships {overlap.id1} and {overlap.id2} overlap during this period
                              </p>
                              <p className="text-xs mt-2 text-muted-foreground">
                                This could indicate a period of infidelity, a transitional phase between relationships,
                                or possibly incorrect date entries. Consider reviewing the timeline accuracy.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                  </div>
                </div>
              )}
            </TooltipProvider>
          </div>
        </div>
      </div>

      {relationships.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No relationships added yet. Click "Add Relationship" to get started.
        </div>
      )}
    </div>
  )
}

