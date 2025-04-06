"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { Relationship } from "@/lib/types"
import { Download, Upload, Copy, Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sampleData } from "@/lib/samples"

interface ImportExportPanelProps {
  relationships: Relationship[]
  onImport: (data: Relationship[]) => void
  onCancel: () => void
}

export default function ImportExportPanel({ relationships, onImport, onCancel }: ImportExportPanelProps) {
  const [importData, setImportData] = useState("")
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [showFormat, setShowFormat] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert dates to strings for JSON export
  const prepareDataForExport = () => {
    return relationships.map((relationship) => ({
      ...relationship,
      startDate: relationship.startDate.toISOString(),
      endDate: relationship.endDate.toISOString(),
      highlights: relationship.highlights.map((highlight) => ({
        ...highlight,
        date: highlight.date.toISOString(),
      })),
      children: relationship.children.map((child) => ({
        ...child,
        conceptionDate: child.conceptionDate.toISOString(),
        birthDate: child.birthDate.toISOString(),
      })),
    }))
  }

  // Convert string dates back to Date objects
  const parseImportedData = (data: any): Relationship[] => {
    try {
      if (!Array.isArray(data)) {
        throw new Error("Imported data must be an array")
      }

      return data.map((item) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        highlights: Array.isArray(item.highlights)
          ? item.highlights.map((h: any) => ({
              ...h,
              date: new Date(h.date),
            }))
          : [],
        children: Array.isArray(item.children)
          ? item.children.map((c: any) => ({
              ...c,
              conceptionDate: new Date(c.conceptionDate),
              birthDate: new Date(c.birthDate),
            }))
          : [],
      }))
    } catch (error) {
      console.error("Error parsing imported data:", error)
      throw new Error("Invalid data format. Please check your JSON structure.")
    }
  }

  const handleExportToFile = () => {
    const data = prepareDataForExport()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "relationship-timeline-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    const data = prepareDataForExport()
    const jsonString = JSON.stringify(data, null, 2)

    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleImportFromText = () => {
    setImportError(null)

    try {
      const data = JSON.parse(importData)
      const parsedData = parseImportedData(data)
      onImport(parsedData)
    } catch (error: any) {
      setImportError(error.message || "Invalid JSON format")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)

    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        const parsedData = parseImportedData(data)
        onImport(parsedData)
      } catch (error: any) {
        setImportError(error.message || "Invalid file format")
      }
    }

    reader.onerror = () => {
      setImportError("Error reading file")
    }

    reader.readAsText(file)
  }

  const handleLoadSample = (sampleName: string) => {
    setImportError(null)

    try {
      const sample = sampleData[sampleName]
      if (!sample) {
        throw new Error("Sample not found")
      }

      const parsedData = parseImportedData(sample)
      onImport(parsedData)
    } catch (error: any) {
      setImportError(error.message || "Error loading sample data")
    }
  }

  // Example format for import
  const formatExample = `[
  {
    "id": "1",
    "name": "Relationship Name",
    "startDate": "2020-01-01T00:00:00.000Z",
    "endDate": "2022-12-31T00:00:00.000Z",
    "color": "#4f46e5",
    "details": "Relationship details go here",
    "moreInfoUrl": "https://example.com/optional-link",
    "highlights": [
      {
        "date": "2021-06-15T00:00:00.000Z",
        "title": "Highlight Title",
        "description": "Description of the highlight"
      }
    ],
    "children": [
      {
        "id": "c1",
        "name": "Child Name",
        "conceptionDate": "2021-01-01T00:00:00.000Z",
        "birthDate": "2021-10-01T00:00:00.000Z",
        "details": "Details about the child"
      }
    ]
  }
]`

  return (
    <div className="space-y-4">
      <Tabs defaultValue="export">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4 pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={handleExportToFile} className="gap-2">
                <Download className="h-4 w-4" />
                Export to File
              </Button>
              <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Your data will be exported as a JSON file that you can save and import later.
            </div>

            <div className="border rounded-md p-4 bg-muted/50 max-h-[250px] overflow-hidden">
              <pre className="text-xs overflow-auto h-full max-w-full" style={{ maxHeight: "calc(250px - 2rem)" }}>
                {JSON.stringify(prepareDataForExport(), null, 2)}
              </pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4 pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload JSON File
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Or load a sample dataset:</div>
              <Select onValueChange={handleLoadSample}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a sample" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Example (3 Relationships)</SelectItem>
                  <SelectItem value="complex">Complex Example (5+ Relationships)</SelectItem>
                  <SelectItem value="analysis">Analysis Test Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Collapsible open={showFormat} onOpenChange={setShowFormat} className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Expected JSON Format</div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                    {showFormat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <div className="rounded-md bg-muted p-4 max-h-[200px] overflow-hidden">
                  <pre className="text-xs overflow-auto h-full max-w-full" style={{ maxHeight: "calc(200px - 2rem)" }}>
                    {formatExample}
                  </pre>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p className="mb-1">Key requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Data must be an array of relationship objects</li>
                    <li>All dates must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)</li>
                    <li>Each relationship must have an id, name, startDate, endDate, and color</li>
                    <li>Children and highlights are optional arrays</li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="text-sm text-muted-foreground">Or paste your JSON data below:</div>

            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your JSON data here..."
              rows={10}
            />

            {importError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleImportFromText} disabled={!importData.trim()}>
                Import Data
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

