"use client"

import { useState, useEffect } from "react"
import Timeline from "@/components/timeline"
import TimelineDetail from "@/components/timeline-detail"
import RelationshipForm from "@/components/relationship-form"
import ImportExportPanel from "@/components/import-export-panel"
import AnalysisSettings from "@/components/analysis-settings"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, BarChart2 } from "lucide-react"
import type { AnalysisOptions, Child, Relationship } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  // Add error boundary handling for ResizeObserver errors
  // Add this near the top of the file, after the imports
  useEffect(() => {
    // Handle ResizeObserver errors globally
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver") || event.error?.message?.includes("ResizeObserver")) {
        // Prevent the error from showing in console
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener("error", handleError as any)
    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason?.message?.includes("ResizeObserver")) {
        event.preventDefault()
      }
    })

    return () => {
      window.removeEventListener("error", handleError as any)
      window.removeEventListener("unhandledrejection", (event) => {
        if (event.reason?.message?.includes("ResizeObserver")) {
          event.preventDefault()
        }
      })
    }
  }, [])
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showAnalysisSettings, setShowAnalysisSettings] = useState(false)
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null)

  // Add cross-relationship children detection to the page component
  // Find children conceived in one relationship but associated with another

  // Update the analysisOptions state to include the new option
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>({
    enabled: false,
    showUnfaithfulPeriods: true,
    showOutOfRangeConceptions: true,
    showCrossRelationshipChildren: true,
  })

  const [relationships, setRelationships] = useState<Relationship[]>([
    {
      id: "1",
      name: "Relationship A",
      startDate: new Date("2000-01-01"),
      endDate: new Date("2006-12-31"),
      color: "#4f46e5", // indigo-600
      details: "This was a significant period with many shared experiences and growth.",
      moreInfoUrl: "https://example.com/relationship-a",
      highlights: [
        {
          date: new Date("2001-06-15"),
          title: "First milestone",
          description: "An important moment in the relationship",
        },
        { date: new Date("2003-08-20"), title: "Second milestone", description: "Another significant event" },
      ],
      children: [
        {
          id: "c1",
          name: "Child 1",
          conceptionDate: new Date("2001-04-01"), // Estimated conception date (9 months before birth)
          birthDate: new Date("2002-01-01"),
          details: "First child",
        },
        {
          id: "c2",
          name: "Twin A",
          conceptionDate: new Date("2002-10-15"), // Estimated conception date
          birthDate: new Date("2003-07-15"),
          details: "First twin",
        },
        {
          id: "c3",
          name: "Twin B",
          conceptionDate: new Date("2002-10-15"), // Same conception date for twins
          birthDate: new Date("2003-07-15"),
          details: "Second twin",
        },
        {
          id: "c4",
          name: "Triplet A",
          conceptionDate: new Date("2004-07-15"), // Estimated conception date
          birthDate: new Date("2005-04-15"),
          details: "First triplet",
        },
        {
          id: "c5",
          name: "Triplet B",
          conceptionDate: new Date("2004-07-15"), // Same conception date for triplets
          birthDate: new Date("2005-04-15"),
          details: "Second triplet",
        },
        {
          id: "c6",
          name: "Triplet C",
          conceptionDate: new Date("2004-07-15"), // Same conception date for triplets
          birthDate: new Date("2005-04-15"),
          details: "Third triplet",
        },
      ],
    },
    {
      id: "2",
      name: "Relationship B",
      startDate: new Date("2006-03-01"), // Note: Overlaps with Relationship A
      endDate: new Date("2009-11-30"),
      color: "#0891b2", // cyan-600
      details: "A period of discovery and new experiences together.",
      moreInfoUrl: "",
      highlights: [{ date: new Date("2007-02-14"), title: "Special occasion", description: "A memorable celebration" }],
      children: [
        {
          id: "c9",
          name: "Out of Range Child",
          conceptionDate: new Date("2005-10-15"), // Conceived before relationship started
          birthDate: new Date("2006-07-15"),
          details: "Conceived before relationship began",
        },
      ],
    },
    {
      id: "3",
      name: "Relationship C",
      startDate: new Date("2010-01-01"),
      endDate: new Date("2012-06-30"),
      color: "#7c3aed", // violet-600
      details: "A shorter but meaningful connection with important lessons.",
      moreInfoUrl: "",
      highlights: [],
      children: [],
    },
    {
      id: "4",
      name: "Relationship D",
      startDate: new Date("2012-01-01"), // Note: Overlaps with Relationship C
      endDate: new Date("2015-12-31"),
      color: "#ea580c", // orange-600
      details: "A long-term relationship with many shared experiences.",
      moreInfoUrl: "https://example.com/relationship-d",
      highlights: [
        { date: new Date("2013-07-10"), title: "Major event", description: "A transformative experience" },
        { date: new Date("2014-03-22"), title: "Important decision", description: "A turning point" },
      ],
      children: [
        {
          id: "c7",
          name: "Child 2",
          conceptionDate: new Date("2013-08-20"),
          birthDate: new Date("2014-05-20"),
          details: "Born during this relationship",
        },
        {
          id: "c8",
          name: "Child 3",
          conceptionDate: new Date("2016-01-10"), // Conceived after relationship ended
          birthDate: new Date("2016-08-10"),
          details: "Conceived after relationship ended",
        },
      ],
    },
    {
      id: "5",
      name: "Relationship E",
      startDate: new Date("2016-02-01"),
      endDate: new Date("2018-09-30"),
      color: "#16a34a", // green-600
      details: "A relationship that brought new perspectives and growth.",
      moreInfoUrl: "",
      highlights: [{ date: new Date("2017-12-25"), title: "Significant moment", description: "A special memory" }],
      children: [],
    },
    {
      id: "6",
      name: "Relationship F",
      startDate: new Date("2018-01-01"), // Note: Overlaps with Relationship E
      endDate: new Date("2020-03-29"),
      color: "#dc2626", // red-600
      details: "The most recent relationship with ongoing developments.",
      moreInfoUrl: "",
      highlights: [{ date: new Date("2019-08-15"), title: "Recent milestone", description: "A notable recent event" }],
      children: [],
    },
  ])

  // Now define the function after relationships is initialized
  const findCrossRelationshipChildren = () => {
    const crossRelationshipChildren: {
      childId: string
      relationshipId: string
      conceptionRelationshipId: string
      relationshipName: string
    }[] = []

    // For each relationship
    relationships.forEach((birthRelationship) => {
      // For each child in this relationship
      birthRelationship.children.forEach((child) => {
        // Check all other relationships to see if the child was conceived during them
        relationships.forEach((conceptionRelationship) => {
          if (
            conceptionRelationship.id !== birthRelationship.id &&
            child.conceptionDate >= conceptionRelationship.startDate &&
            child.conceptionDate <= conceptionRelationship.endDate
          ) {
            crossRelationshipChildren.push({
              childId: child.id,
              relationshipId: birthRelationship.id,
              conceptionRelationshipId: conceptionRelationship.id,
              relationshipName: conceptionRelationship.name,
            })
          }
        })
      })
    })

    return crossRelationshipChildren
  }

  // Calculate cross-relationship children
  const crossRelationshipChildren =
    analysisOptions.enabled && analysisOptions.showCrossRelationshipChildren ? findCrossRelationshipChildren() : []

  // Prepare cross-relationship data for the TimelineDetail component
  const getCrossRelationshipDataForRelationship = (relationshipId: string) => {
    return crossRelationshipChildren
      .filter((item) => item.relationshipId === relationshipId || item.conceptionRelationshipId === relationshipId)
      .map((item) => ({
        childId: item.childId,
        relationshipName: item.relationshipName,
      }))
  }

  const handleAddRelationship = (relationship: Relationship) => {
    if (editingRelationship) {
      // Update existing relationship
      setRelationships(relationships.map((r) => (r.id === editingRelationship.id ? relationship : r)))
      setEditingRelationship(null)
    } else {
      // Add new relationship
      const newRelationship = {
        ...relationship,
        id: (relationships.length + 1).toString(),
      }
      setRelationships([...relationships, newRelationship])
    }
    setShowForm(false)
  }

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship)
    setShowForm(true)
  }

  const handleDeleteRelationship = (relationshipId: string) => {
    setRelationships(relationships.filter((r) => r.id !== relationshipId))
    if (selectedRelationship?.id === relationshipId) {
      setSelectedRelationship(null)
    }
  }

  const handleAddChild = (relationshipId: string, child: Child) => {
    setRelationships(
      relationships.map((r) => {
        if (r.id === relationshipId) {
          return {
            ...r,
            children: [...r.children, { ...child, id: `c${Date.now()}` }],
          }
        }
        return r
      }),
    )
  }

  const handleDeleteChild = (relationshipId: string, childId: string) => {
    setRelationships(
      relationships.map((r) => {
        if (r.id === relationshipId) {
          return {
            ...r,
            children: r.children.filter((c) => c.id !== childId),
          }
        }
        return r
      }),
    )
  }

  const handleImportData = (importedData: Relationship[]) => {
    setRelationships(importedData)
    setShowImportExport(false)
  }

  const handleUpdateAnalysisOptions = (options: AnalysisOptions) => {
    setAnalysisOptions(options)
    setShowAnalysisSettings(false)
  }

  // Find overlapping relationships for analysis
  const findOverlappingRelationships = () => {
    const overlaps: { id1: string; id2: string; startDate: Date; endDate: Date }[] = []

    for (let i = 0; i < relationships.length; i++) {
      for (let j = i + 1; j < relationships.length; j++) {
        const rel1 = relationships[i]
        const rel2 = relationships[j]

        // Check if relationships overlap
        if (rel1.startDate <= rel2.endDate && rel2.startDate <= rel1.endDate) {
          // Calculate overlap period
          const overlapStart = new Date(Math.max(rel1.startDate.getTime(), rel2.startDate.getTime()))
          const overlapEnd = new Date(Math.min(rel1.endDate.getTime(), rel2.endDate.getTime()))

          overlaps.push({
            id1: rel1.id,
            id2: rel2.id,
            startDate: overlapStart,
            endDate: overlapEnd,
          })
        }
      }
    }

    return overlaps
  }

  // Find children conceived outside of relationship range
  const findOutOfRangeConceptions = () => {
    const outOfRangeConceptions: { relationshipId: string; childId: string }[] = []

    relationships.forEach((relationship) => {
      relationship.children.forEach((child) => {
        if (child.conceptionDate < relationship.startDate || child.conceptionDate > relationship.endDate) {
          outOfRangeConceptions.push({
            relationshipId: relationship.id,
            childId: child.id,
          })
        }
      })
    })

    return outOfRangeConceptions
  }

  const overlappingRelationships =
    analysisOptions.enabled && analysisOptions.showUnfaithfulPeriods ? findOverlappingRelationships() : []

  const outOfRangeConceptions =
    analysisOptions.enabled && analysisOptions.showOutOfRangeConceptions ? findOutOfRangeConceptions() : []

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Relationship Timeline</h1>
      <p className="text-center text-muted-foreground mb-8">An interactive visualization of relationship periods</p>

      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant={analysisOptions.enabled ? "default" : "outline"}
          onClick={() => setShowAnalysisSettings(true)}
          className="gap-2"
        >
          <BarChart2 className="h-4 w-4" />
          Analysis
        </Button>
        <Button variant="outline" onClick={() => setShowImportExport(true)} className="gap-2">
          <Download className="h-4 w-4" />
          Import/Export
        </Button>
        <Button
          onClick={() => {
            setEditingRelationship(null)
            setShowForm(true)
          }}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Relationship
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Timeline
          relationships={relationships}
          onSelectRelationship={setSelectedRelationship}
          selectedRelationship={selectedRelationship}
          analysisOptions={analysisOptions}
          overlappingRelationships={overlappingRelationships}
          outOfRangeConceptions={outOfRangeConceptions}
          crossRelationshipChildren={crossRelationshipChildren}
        />
      </div>

      {selectedRelationship && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TimelineDetail
            relationship={selectedRelationship}
            onEdit={handleEditRelationship}
            onDelete={handleDeleteRelationship}
            onAddChild={handleAddChild}
            onDeleteChild={handleDeleteChild}
            outOfRangeConceptions={outOfRangeConceptions
              .filter((item) => item.relationshipId === selectedRelationship.id)
              .map((item) => item.childId)}
            crossRelationshipChildren={getCrossRelationshipDataForRelationship(selectedRelationship.id)}
          />
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRelationship ? "Edit Relationship" : "Add New Relationship"}</DialogTitle>
          </DialogHeader>
          <RelationshipForm
            onSubmit={handleAddRelationship}
            initialData={editingRelationship}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showImportExport} onOpenChange={setShowImportExport}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Import/Export Data</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(80vh - 120px)" }}>
            <ImportExportPanel
              relationships={relationships}
              onImport={handleImportData}
              onCancel={() => setShowImportExport(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAnalysisSettings} onOpenChange={setShowAnalysisSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Analysis Settings</DialogTitle>
          </DialogHeader>
          <AnalysisSettings
            options={analysisOptions}
            onUpdate={handleUpdateAnalysisOptions}
            onCancel={() => setShowAnalysisSettings(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}

