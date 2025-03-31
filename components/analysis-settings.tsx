"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { AnalysisOptions } from "@/lib/types"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AnalysisSettingsProps {
  options: AnalysisOptions
  onUpdate: (options: AnalysisOptions) => void
  onCancel: () => void
}

// Update the AnalysisSettings component to include cross-relationship detection
export default function AnalysisSettings({ options, onUpdate, onCancel }: AnalysisSettingsProps) {
  const [localOptions, setLocalOptions] = useState<AnalysisOptions>({
    ...options,
    showCrossRelationshipChildren: options.showCrossRelationshipChildren ?? true,
  })

  const handleToggleEnabled = (checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      enabled: checked,
    }))
  }

  const handleToggleUnfaithful = (checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      showUnfaithfulPeriods: checked,
    }))
  }

  const handleToggleOutOfRange = (checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      showOutOfRangeConceptions: checked,
    }))
  }

  const handleToggleCrossRelationship = (checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      showCrossRelationshipChildren: checked,
    }))
  }

  const handleSave = () => {
    onUpdate(localOptions)
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="enable-analysis" checked={localOptions.enabled} onCheckedChange={handleToggleEnabled} />
        <Label htmlFor="enable-analysis" className="font-medium">
          Enable Analysis
        </Label>
      </div>

      <div className="pl-6 space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="show-unfaithful"
            checked={localOptions.showUnfaithfulPeriods}
            onCheckedChange={handleToggleUnfaithful}
            disabled={!localOptions.enabled}
          />
          <div className="grid gap-1.5">
            <Label htmlFor="show-unfaithful" className={!localOptions.enabled ? "text-muted-foreground" : ""}>
              Show Overlapping Relationships
            </Label>
            <p className="text-sm text-muted-foreground">
              Highlight periods where relationships overlap in time. This could indicate infidelity, transitional
              periods, or possibly incorrect date entries.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="show-out-of-range"
            checked={localOptions.showOutOfRangeConceptions}
            onCheckedChange={handleToggleOutOfRange}
            disabled={!localOptions.enabled}
          />
          <div className="grid gap-1.5">
            <Label htmlFor="show-out-of-range" className={!localOptions.enabled ? "text-muted-foreground" : ""}>
              Show Out-of-Range Conceptions
            </Label>
            <p className="text-sm text-muted-foreground">
              Highlight children conceived outside of relationship timeframe. This might indicate infidelity, data entry
              errors, or children that should be associated with different relationships.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="show-cross-relationship"
            checked={localOptions.showCrossRelationshipChildren}
            onCheckedChange={handleToggleCrossRelationship}
            disabled={!localOptions.enabled}
          />
          <div className="grid gap-1.5">
            <Label htmlFor="show-cross-relationship" className={!localOptions.enabled ? "text-muted-foreground" : ""}>
              Show Cross-Relationship Children
            </Label>
            <p className="text-sm text-muted-foreground">
              Identify children conceived in one relationship but associated with another. This could indicate complex
              relationship transitions, co-parenting arrangements, or data entry errors.
            </p>
          </div>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Information</AlertTitle>
        <AlertDescription className="text-sm">
          Analysis features help identify potential inconsistencies in your timeline data. These patterns might indicate
          infidelity, data entry errors, or complex relationship dynamics. This information is displayed visually on the
          timeline and is only visible to you.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}

