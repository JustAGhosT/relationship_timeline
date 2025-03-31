export interface Highlight {
  date: Date
  title: string
  description: string
}

export interface Child {
  id: string
  name: string
  conceptionDate: Date
  birthDate: Date
  details: string
}

export interface Relationship {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
  details: string
  moreInfoUrl: string
  highlights: Highlight[]
  children: Child[]
}

export interface AnalysisOptions {
  enabled: boolean
  showUnfaithfulPeriods: boolean
  showOutOfRangeConceptions: boolean
  showCrossRelationshipChildren?: boolean
}

export interface Task {
  id: string
  name: string
  start: Date
  end: Date
  progress: number
  type: string
  dependencies: string[]
}

