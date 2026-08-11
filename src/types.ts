export type ReportKind = 'help' | 'damage' | 'landslide' | 'road' | 'water' | 'medical' | 'shelter'
export type Verification = 'unverified' | 'evidence' | 'community' | 'verified'

export interface Incident {
  id: string
  kind: ReportKind
  title: string
  place: string
  description: string
  time: string
  verification: Verification
  x: number
  y: number
  people?: number
}

export interface MissingPerson {
  id: string
  name: string
  age: number
  place: string
  lastSeen: string
  status: 'missing' | 'sighting' | 'located'
  initials: string
}
