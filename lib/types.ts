export interface Highlight {
  date: Date
  title: string
  description: string
  confirmed?: boolean
}

export interface Child {
  id: string
  name: string
  conceptionDate: Date
  birthDate: Date
  details: string
  confirmed?: boolean
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
  confirmed?: boolean
}

export interface AnalysisOptions {
  enabled: boolean
  showUnfaithfulPeriods: boolean
  showOutOfRangeConceptions: boolean
  showCrossRelationshipChildren?: boolean
  showUnconfirmedEvents?: boolean
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

