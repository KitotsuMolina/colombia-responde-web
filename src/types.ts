export type ReportKind = 'help' | 'damage' | 'landslide' | 'road' | 'water' | 'power' | 'medical' | 'shelter' | 'aid'
export type Verification = 'unverified' | 'evidence' | 'community' | 'verified' | 'official'

export interface ApiLocation {
  departmentCode: string
  departmentName: string
  municipalityCode: string
  municipalityName: string
  locality?: string
}

export interface ApiIncident {
  id: string
  kind: ReportKind
  title: string
  description: string
  location: ApiLocation
  coordinates: { type: 'Point'; coordinates: [number, number] }
  peopleAtRisk?: number
  verificationStatus: Verification
  confirmationCount: number
  status: 'active' | 'resolved' | 'archived'
  createdAt: string
  updatedAt: string
}

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
  latitude: number
  longitude: number
}

export interface ApiMissingPerson {
  id: string
  fullName: string
  age?: number
  photoUrl?: string
  location: ApiLocation
  lastSeenAt: string
  lastSeenDetails: string
  status: 'missing' | 'sighting' | 'located'
  createdAt: string
  updatedAt: string
}

export interface MissingPerson {
  id: string
  name: string
  age?: number
  place: string
  lastSeen: string
  status: 'missing' | 'sighting' | 'located'
  initials: string
}
