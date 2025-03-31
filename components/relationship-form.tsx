"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Highlight, Relationship } from "@/lib/types"
import { Trash, Plus, Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface RelationshipFormProps {
  onSubmit: (relationship: Relationship) => void
  initialData: Relationship | null
  onCancel: () => void
}

export default function RelationshipForm({ onSubmit, initialData, onCancel }: RelationshipFormProps) {
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [color, setColor] = useState("#4f46e5")
  const [details, setDetails] = useState("")
  const [moreInfoUrl, setMoreInfoUrl] = useState("")
  const [highlights, setHighlights] = useState<Omit<Highlight, "id">[]>([])

  // Predefined color palette
  const colorPalette = [
    "#4f46e5", // indigo-600
    "#0891b2", // cyan-600
    "#7c3aed", // violet-600
    "#ea580c", // orange-600
    "#16a34a", // green-600
    "#dc2626", // red-600
    "#0284c7", // sky-600
    "#9333ea", // purple-600
    "#db2777", // pink-600
    "#65a30d", // lime-600
    "#f59e0b", // amber-500
    "#6b7280", // gray-500
  ]

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setStartDate(formatDateForInput(initialData.startDate))
      setEndDate(formatDateForInput(initialData.endDate))
      setColor(initialData.color)
      setDetails(initialData.details)
      setMoreInfoUrl(initialData.moreInfoUrl || "")
      setHighlights(
        initialData.highlights.map((h) => ({
          date: h.date,
          title: h.title,
          description: h.description,
        })),
      )
    } else {
      // Default values for new relationship
      setName("")
      setStartDate("")
      setEndDate("")
      setColor(getRandomColor())
      setDetails("")
      setMoreInfoUrl("")
      setHighlights([])
    }
  }, [initialData])

  // Format date as YYYY-MM-DD for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Generate a random color
  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !startDate || !endDate) return

    const relationship: Relationship = {
      id: initialData?.id || "",
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color,
      details,
      moreInfoUrl: moreInfoUrl || "",
      highlights,
      children: initialData?.children || [],
    }

    onSubmit(relationship)
  }

  const addHighlight = () => {
    setHighlights([
      ...highlights,
      {
        date: new Date(),
        title: "",
        description: "",
      },
    ])
  }

  const updateHighlight = (index: number, field: keyof Omit<Highlight, "id">, value: any) => {
    const updatedHighlights = [...highlights]

    if (field === "date") {
      updatedHighlights[index][field] = new Date(value)
    } else {
      updatedHighlights[index][field] = value
    }

    setHighlights(updatedHighlights)
  }

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Relationship Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter relationship name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2">
          <div
            className="w-12 h-10 rounded-md border flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: color }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="space-y-2">
                  <div className="font-medium text-sm">Choose a color</div>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPalette.map((paletteColor) => (
                      <div
                        key={paletteColor}
                        className="w-8 h-8 rounded-md cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: paletteColor }}
                        onClick={() => setColor(paletteColor)}
                      />
                    ))}
                  </div>
                  <div className="pt-2">
                    <Label htmlFor="custom-color" className="text-xs">
                      Custom color
                    </Label>
                    <Input
                      id="custom-color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-8 p-1 w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#RRGGBB" className="flex-1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter relationship details"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="more-info">More Info URL (Optional)</Label>
        <Input
          id="more-info"
          type="url"
          value={moreInfoUrl}
          onChange={(e) => setMoreInfoUrl(e.target.value)}
          placeholder="https://example.com/more-info"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="gap-1">
            <Plus className="h-3 w-3" />
            Add Highlight
          </Button>
        </div>

        {highlights.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground border rounded-md">
            No highlights added yet
          </div>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="border rounded-md p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Highlight {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHighlight(index)}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`highlight-title-${index}`} className="text-xs">
                      Title
                    </Label>
                    <Input
                      id={`highlight-title-${index}`}
                      value={highlight.title}
                      onChange={(e) => updateHighlight(index, "title", e.target.value)}
                      placeholder="Title"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`highlight-date-${index}`} className="text-xs">
                      Date
                    </Label>
                    <Input
                      id={`highlight-date-${index}`}
                      type="date"
                      value={formatDateForInput(highlight.date)}
                      onChange={(e) => updateHighlight(index, "date", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`highlight-desc-${index}`} className="text-xs">
                    Description
                  </Label>
                  <Input
                    id={`highlight-desc-${index}`}
                    value={highlight.description}
                    onChange={(e) => updateHighlight(index, "description", e.target.value)}
                    placeholder="Description"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Relationship"}</Button>
      </div>
    </form>
  )
}

