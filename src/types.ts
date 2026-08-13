export type ReportKind = 'help' | 'damage' | 'landslide' | 'road' | 'water' | 'power' | 'medical' | 'shelter' | 'aid'
export type Verification = 'unverified' | 'evidence' | 'community' | 'verified' | 'official'
export interface AreaPoint { latitude:number;longitude:number }

export interface ApiLocation {
  departmentCode?: string
  departmentName: string
  municipalityCode?: string
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
  area?: AreaPoint[]
  sourceName?: string
  sourceUrl?: string
  externalId?: string
  sourceUpdatedAt?: string
  sourceData?: {
    sourceState?:string;sourceType?:string;saturation?:string;needs?:string[];contact?:string;notes?:string
    confirmations?:number;denials?:number;sourceVerified?:boolean;fresh?:boolean;confirmedAt?:number
    volunteersAvailable?:number;volunteersNeeded?:number
    media?:Array<{url?:string;mime?:string;caption?:string;timestamp?:number}>
  }
  peopleAtRisk?: number
  verificationStatus: Verification
  confirmationCount: number
  status: 'active' | 'resolved' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Incident {
  sourceId: string
  id: string
  kind: ReportKind
  title: string
  place: string
  municipality: string
  locality?: string
  description: string
  time: string
  createdAt: string
  noAttend?: boolean
  needsPeople?: boolean
  staleHours?: number
  fadeExempt?: boolean
  verification: Verification
  x: number
  y: number
  people?: number
  latitude: number
  longitude: number
  area?: AreaPoint[]
}
export interface IncidentEvidence { id:string;url:string;mimeType:string;sizeBytes:number;createdAt:string }
export interface ApiIncidentDetail extends ApiIncident { evidence:IncidentEvidence[];sourceLog?:Array<{text:string;author?:string;timestamp:number}> }

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

export interface ApiSafetyCheckIn {
  id: string
  fullName: string
  location: ApiLocation
  message?: string
  publicCode: string
  status: 'self_reported' | 'verified' | 'removed'
  expiresAt: string
  createdAt: string
  updatedAt: string
  deleteToken?: string
}

export interface CitizenAction {
  id:string
  title:string
  contactName:string
  contactPhone:string
  actionDescription:string
  donationMethod?:string
  departmentName:string
  municipalityName:string
  locality?:string
  status:'pending'|'published'
  validationExpiresAt:string
  consentedAt?:string
  createdAt:string
  updatedAt:string
}
export interface AnalyticsData {generatedAt:string;scope:string;summary:{total:number;attended:number;pending:number;unknown:number;responseRate:number|null};pendingAge:{under1:number;from1to3:number;from3to6:number;from6to12:number;over12:number};cities:Array<{name:string;total:number;attended:number;pending:number;unknown:number;responseRate:number|null}>;needs:Array<{label:string;count:number}>;hourly:Array<{hour:string;created:number}>;methodology:{attended:string;pending:string;unknown:string;responseTimesAvailable:boolean;responseTimesNote:string}}
