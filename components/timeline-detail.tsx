"use client"

import { useState } from "react"
import type { Child, Relationship } from "@/lib/types"
import { AlertTriangle, Calendar, Clock, Edit, ExternalLink, Trash, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// Update the isChildOutOfRange function to also check for cross-relationship children
const isChildOutOfRange = (
  childId: string,
  outOfRangeConceptions: string[],
  crossRelationshipChildren: string[] = [],
) => {
  return outOfRangeConceptions.includes(childId) || crossRelationshipChildren.includes(childId)
}

// Add a function to get the conception relationship name for a cross-relationship child
const getConceptionRelationshipName = (
  childId: string,
  crossRelationshipData: { childId: string; relationshipName: string }[] = [],
) => {
  const crossChild = crossRelationshipData.find((item) => item.childId === childId)
  return crossChild ? crossChild.relationshipName : null
}

interface TimelineDetailProps {
  relationship: Relationship
  onEdit: (relationship: Relationship) => void
  onDelete: (relationshipId: string) => void
  onAddChild: (relationshipId: string, child: Child) => void
  onDeleteChild: (relationshipId: string, childId: string) => void
  outOfRangeConceptions: string[]
  crossRelationshipChildren?: { childId: string; relationshipName: string }[]
}

export default function TimelineDetail({
  relationship,
  onEdit,
  onDelete,
  onAddChild,
  onDeleteChild,
  outOfRangeConceptions,
  crossRelationshipChildren = [],
}: TimelineDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddChildForm, setShowAddChildForm] = useState(false)
  const [childToDelete, setChildToDelete] = useState<string | null>(null)

  const [newChild, setNewChild] = useState<Omit<Child, "id">>({
    name: "",
    conceptionDate: new Date(),
    birthDate: new Date(),
    details: "",
  })

  // Format date as Month DD, YYYY (e.g., January 1, 2020)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format date as YYYY-MM-DD for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Calculate duration in years and months
  const calculateDuration = (start: Date, end: Date) => {
    const yearDiff = end.getFullYear() - start.getFullYear()
    const monthDiff = end.getMonth() - start.getMonth()

    let years = yearDiff
    let months = monthDiff

    if (monthDiff < 0) {
      years -= 1
      months += 12
    }

    const yearText = years > 0 ? `${years} year${years !== 1 ? "s" : ""}` : ""
    const monthText = months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : ""

    if (yearText && monthText) {
      return `${yearText}, ${monthText}`
    } else {
      return yearText || monthText || "Less than a month"
    }
  }

  const handleAddChild = () => {
    onAddChild(relationship.id, newChild)
    setNewChild({
      name: "",
      conceptionDate: new Date(),
      birthDate: new Date(),
      details: "",
    })
    setShowAddChildForm(false)
  }

  // Check if a child is out of range or cross-relationship
  const isChildOutOfRangeOrCross = (childId: string) => {
    return isChildOutOfRange(
      childId,
      outOfRangeConceptions,
      crossRelationshipChildren.map((c) => c.childId),
    )
  }

  // Check if a child is specifically cross-relationship
  const isChildCrossRelationship = (childId: string) => {
    return crossRelationshipChildren.some((item) => item.childId === childId)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: relationship.color }} />
        <h2 className="text-2xl font-bold">{relationship.name}</h2>
        {relationship.moreInfoUrl && (
          <a
            href={relationship.moreInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            More information
          </a>
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(relationship)} className="gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Timeline</span>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Start Date:</span>
              <span>{formatDate(relationship.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">End Date:</span>
              <span>{formatDate(relationship.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>{calculateDuration(relationship.startDate, relationship.endDate)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Details</span>
            </div>

            <p className="text-muted-foreground mb-4 bg-gray-50 p-4 rounded-md">{relationship.details}</p>
          </div>

          {relationship.highlights.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span>Key Highlights</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{relationship.highlights.length}</span>
              </h3>
              <div className="space-y-3">
                {relationship.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="border-l-2 pl-3 py-2 bg-gray-50 rounded-r-md"
                    style={{ borderColor: relationship.color }}
                  >
                    <div className="font-medium">{highlight.title}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(highlight.date)}</div>
                    <div className="text-sm mt-1">{highlight.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Children</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAddChildForm(true)} className="gap-1">
              <UserPlus className="h-4 w-4" />
              Add Child
            </Button>
          </div>

          {relationship.children.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-md">
              No children recorded for this relationship.
            </div>
          ) : (
            <div className="space-y-4">
              {relationship.children.map((child) => {
                const outOfRange = outOfRangeConceptions.includes(child.id)
                const isCrossRelationship = isChildCrossRelationship(child.id)
                const conceptionRelationshipName = isCrossRelationship
                  ? getConceptionRelationshipName(child.id, crossRelationshipChildren)
                  : null

                return (
                  <div
                    key={child.id}
                    className={cn(
                      "border rounded-md p-4 bg-gray-50 hover:shadow transition-shadow",
                      outOfRange ? "border-red-300" : "",
                      isCrossRelationship ? "border-blue-300" : "",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{child.name}</h4>
                          {outOfRange && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Out of range
                            </span>
                          )}
                          {isCrossRelationship && (
                            <span className="text-xs text-blue-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Cross-relationship
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Conception: {formatDate(child.conceptionDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">Birth: {formatDate(child.birthDate)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setChildToDelete(child.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    {child.details && <div className="mt-2 text-sm border-t pt-2">{child.details}</div>}
                    {outOfRange && (
                      <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
                        This child was conceived outside the timeframe of this relationship.
                        <p className="mt-1 text-muted-foreground">
                          This might indicate infidelity, incorrect date entries, or that this child should be
                          associated with a different relationship.
                        </p>
                      </div>
                    )}
                    {isCrossRelationship && conceptionRelationshipName && (
                      <div className="mt-2 text-xs text-blue-500 bg-blue-50 p-2 rounded border border-blue-200">
                        This child was conceived during the relationship: <strong>{conceptionRelationshipName}</strong>
                        <p className="mt-1 text-muted-foreground">
                          This indicates a child conceived in one relationship but associated with another. This could
                          represent a complex relationship transition or possibly data entry errors.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Relationship Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the relationship "{relationship.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(relationship.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Child Confirmation */}
      <AlertDialog open={childToDelete !== null} onOpenChange={(open) => !open && setChildToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete child record?</AlertDialogTitle>
            <AlertDialogDescription>This will remove this child from the relationship record.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (childToDelete) {
                  onDeleteChild(relationship.id, childToDelete)
                  setChildToDelete(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Child Form */}
      <Dialog open={showAddChildForm} onOpenChange={setShowAddChildForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="child-name">Name</Label>
              <Input
                id="child-name"
                value={newChild.name}
                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conception-date">Conception Date</Label>
              <Input
                id="conception-date"
                type="date"
                value={formatDateForInput(newChild.conceptionDate)}
                onChange={(e) =>
                  setNewChild({
                    ...newChild,
                    conceptionDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-date">Birth Date</Label>
              <Input
                id="birth-date"
                type="date"
                value={formatDateForInput(newChild.birthDate)}
                onChange={(e) =>
                  setNewChild({
                    ...newChild,
                    birthDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-details">Details (Optional)</Label>
              <Textarea
                id="child-details"
                value={newChild.details}
                onChange={(e) => setNewChild({ ...newChild, details: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddChildForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChild}>Add Child</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

