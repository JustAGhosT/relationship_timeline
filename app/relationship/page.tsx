"use client"

import { useState, useEffect } from "react"
import Timeline from "@/components/timeline"
import TimelineDetail from "@/components/timeline-detail"
import RelationshipForm from "@/components/relationship-form"
import ImportExportPanel from "@/components/import-export-panel"
import AnalysisSettings from "@/components/analysis-settings"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, BarChart2, Filter, RefreshCw } from "lucide-react"
import type { AnalysisOptions, Child, Relationship } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  getRelationships,
  saveRelationship,
  deleteRelationship,
  addChild,
  deleteChild,
  seedDatabase,
} from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function RelationshipPage() {
  // Add error boundary handling for ResizeObserver errors
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

  const { toast } = useToast()
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showAnalysisSettings, setShowAnalysisSettings] = useState(false)
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null)
  const [showUnconfirmed, setShowUnconfirmed] = useState(true)
  const [loading, setLoading] = useState(true)

  // Update the analysisOptions state to include the new option and enable by default
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>({
    enabled: true, // Enable analysis by default
    showUnfaithfulPeriods: true,
    showOutOfRangeConceptions: true,
    showCrossRelationshipChildren: true,
    showUnconfirmedEvents: true,
  })

  // Use Supabase for data storage
  const [relationships, setRelationships] = useState<Relationship[]>([])

  // Load relationships from Supabase
  useEffect(() => {
    const loadRelationships = async () => {
      setLoading(true)
      try {
        const data = await getRelationships()
        setRelationships(data)
      } catch (error) {
        console.error("Error loading relationships:", error)
        toast({
          title: "Error",
          description: "Failed to load relationships",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRelationships()
  }, [toast])

  // Filter relationships based on confirmation status if needed
  const filteredRelationships = showUnconfirmed ? relationships : relationships.filter((r) => r.confirmed !== false)

  // Now define the function after relationships is initialized
  const findCrossRelationshipChildren = () => {
    const crossRelationshipChildren: {
      childId: string
      relationshipId: string
      conceptionRelationshipId: string
      relationshipName: string
    }[] = []

    // For each relationship
    filteredRelationships.forEach((birthRelationship) => {
      // For each child in this relationship
      birthRelationship.children.forEach((child) => {
        // Check all other relationships to see if the child was conceived during them
        filteredRelationships.forEach((conceptionRelationship) => {
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

  // Handle selecting a relationship - enable analysis when a relationship is selected
  const handleSelectRelationship = (relationship: Relationship | null) => {
    setSelectedRelationship(relationship)

    // Enable analysis when a relationship is selected
    if (relationship && !analysisOptions.enabled) {
      setAnalysisOptions({
        ...analysisOptions,
        enabled: true,
      })
    }
  }

  const handleAddRelationship = async (relationship: Relationship) => {
    try {
      const savedRelationship = await saveRelationship(relationship)

      if (!savedRelationship) {
        toast({
          title: "Error",
          description: "Failed to save relationship",
          variant: "destructive",
        })
        return
      }

      if (editingRelationship) {
        // Update existing relationship
        setRelationships(relationships.map((r) => (r.id === savedRelationship.id ? savedRelationship : r)))
        setEditingRelationship(null)

        // Update selected relationship if it was edited
        if (selectedRelationship?.id === savedRelationship.id) {
          setSelectedRelationship(savedRelationship)
        }
      } else {
        // Add new relationship
        setRelationships([...relationships, savedRelationship])
      }

      setShowForm(false)

      toast({
        title: "Success",
        description: `Relationship ${editingRelationship ? "updated" : "added"} successfully`,
      })
    } catch (error) {
      console.error("Error saving relationship:", error)
      toast({
        title: "Error",
        description: "Failed to save relationship",
        variant: "destructive",
      })
    }
  }

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship)
    setShowForm(true)
  }

  const handleDeleteRelationship = async (relationshipId: string) => {
    try {
      const success = await deleteRelationship(relationshipId)

      if (!success) {
        toast({
          title: "Error",
          description: "Failed to delete relationship",
          variant: "destructive",
        })
        return
      }

      setRelationships(relationships.filter((r) => r.id !== relationshipId))

      if (selectedRelationship?.id === relationshipId) {
        setSelectedRelationship(null)
      }

      toast({
        title: "Success",
        description: "Relationship deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting relationship:", error)
      toast({
        title: "Error",
        description: "Failed to delete relationship",
        variant: "destructive",
      })
    }
  }

  const handleAddChild = async (relationshipId: string, childData: Omit<Child, "id">) => {
    try {
      const newChild = await addChild(relationshipId, childData)

      if (!newChild) {
        toast({
          title: "Error",
          description: "Failed to add child",
          variant: "destructive",
        })
        return
      }

      // Update relationships state
      setRelationships(
        relationships.map((r) => {
          if (r.id === relationshipId) {
            return {
              ...r,
              children: [...r.children, newChild],
            }
          }
          return r
        }),
      )

      // Update selected relationship if needed
      if (selectedRelationship?.id === relationshipId) {
        setSelectedRelationship({
          ...selectedRelationship,
          children: [...selectedRelationship.children, newChild],
        })
      }

      toast({
        title: "Success",
        description: "Child added successfully",
      })
    } catch (error) {
      console.error("Error adding child:", error)
      toast({
        title: "Error",
        description: "Failed to add child",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChild = async (relationshipId: string, childId: string) => {
    try {
      const success = await deleteChild(childId)

      if (!success) {
        toast({
          title: "Error",
          description: "Failed to delete child",
          variant: "destructive",
        })
        return
      }

      // Update relationships state
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

      // Update selected relationship if needed
      if (selectedRelationship?.id === relationshipId) {
        setSelectedRelationship({
          ...selectedRelationship,
          children: selectedRelationship.children.filter((c) => c.id !== childId),
        })
      }

      toast({
        title: "Success",
        description: "Child deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting child:", error)
      toast({
        title: "Error",
        description: "Failed to delete child",
        variant: "destructive",
      })
    }
  }

  const handleImportData = async (importedData: Relationship[]) => {
    try {
      // Save each imported relationship to the database
      const savedRelationships: Relationship[] = []

      for (const relationship of importedData) {
        const savedRelationship = await saveRelationship(relationship)
        if (savedRelationship) {
          savedRelationships.push(savedRelationship)
        }
      }

      setRelationships(savedRelationships)
      setShowImportExport(false)

      toast({
        title: "Success",
        description: `Imported ${savedRelationships.length} relationships successfully`,
      })
    } catch (error) {
      console.error("Error importing data:", error)
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAnalysisOptions = (options: AnalysisOptions) => {
    setAnalysisOptions(options)
    setShowAnalysisSettings(false)
  }

  const handleSeedDatabase = async () => {
    try {
      setLoading(true)
      await seedDatabase()

      // Reload relationships
      const data = await getRelationships()
      setRelationships(data)

      toast({
        title: "Success",
        description: "Database seeded successfully",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Find overlapping relationships for analysis
  const findOverlappingRelationships = () => {
    const overlaps: { id1: string; id2: string; startDate: Date; endDate: Date }[] = []

    for (let i = 0; i < filteredRelationships.length; i++) {
      for (let j = i + 1; j < filteredRelationships.length; j++) {
        const rel1 = filteredRelationships[i]
        const rel2 = filteredRelationships[j]

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

    filteredRelationships.forEach((relationship) => {
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Elon Musk Relationship Timeline</h1>
      <p className="text-center text-muted-foreground mb-8">
        An interactive visualization of Elon Musk's relationships and children
      </p>

      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-unconfirmed" checked={showUnconfirmed} onCheckedChange={setShowUnconfirmed} />
            <Label htmlFor="show-unconfirmed" className="flex items-center gap-1 text-sm">
              <Filter className="h-3.5 w-3.5" />
              Show Unconfirmed
            </Label>
          </div>

          <Button variant="outline" size="sm" onClick={handleSeedDatabase} disabled={loading} className="gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Seed Database
          </Button>
        </div>

        <div className="flex gap-2">
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Timeline
            relationships={filteredRelationships}
            onSelectRelationship={handleSelectRelationship}
            selectedRelationship={selectedRelationship}
            analysisOptions={analysisOptions}
            overlappingRelationships={overlappingRelationships}
            outOfRangeConceptions={outOfRangeConceptions}
            crossRelationshipChildren={crossRelationshipChildren}
          />
        )}
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
    </div>
  )
}

