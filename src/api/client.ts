import type { ApiIncident, ApiIncidentDetail, ApiLocation, ApiMissingPerson, ApiSafetyCheckIn, AreaPoint, IncidentEvidence, ReportKind } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')
export const incidentStreamUrl = `${API_BASE_URL}/incidents/stream`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string | string[] } | null
    const message = Array.isArray(payload?.message) ? payload.message.join('. ') : payload?.message
    throw new Error(message || `La API respondió ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string; database: string; redis: string }>('/health'),
  incidents: () => request<ApiIncident[]>('/incidents'),
  incident: (id:string) => request<ApiIncidentDetail>(`/incidents/${id}`),
  createIncident: (payload: {
    kind: ReportKind; title: string; description: string; location: ApiLocation
    longitude: number; latitude: number; peopleAtRisk?: number
  }) => request<ApiIncident>('/incidents', { method: 'POST', body: JSON.stringify(payload) }),
  adminCreateIncident:(token:string,payload:{kind:ReportKind;title:string;description:string;location:ApiLocation;longitude:number;latitude:number;peopleAtRisk?:number;area?:AreaPoint[]})=>request<ApiIncident>('/admin/incidents',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(payload)}),
  evidenceUploadUrl:(incidentId:string,file:Blob)=>request<{id:string;uploadUrl:string;expiresAt:string}>(`/incidents/${incidentId}/evidence/upload-url`,{method:'POST',body:JSON.stringify({mimeType:file.type,sizeBytes:file.size})}),
  completeEvidence:(incidentId:string,id:string)=>request<IncidentEvidence>(`/incidents/${incidentId}/evidence/${id}/complete`,{method:'POST'}),
  people: (query = '') => request<ApiMissingPerson[]>(`/missing-persons${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  createPerson: (payload: {
    fullName: string; age?: number; location: ApiLocation; lastSeenAt: string
    lastSeenDetails: string; contactToken: string
  }) => request<ApiMissingPerson>('/missing-persons', { method: 'POST', body: JSON.stringify(payload) }),
  safetyCheckIns: (query = '') => request<ApiSafetyCheckIn[]>(`/safety-check-ins${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  createSafetyCheckIn: (payload: { fullName: string; location: ApiLocation; message?: string; longitude?: number; latitude?: number }) =>
    request<ApiSafetyCheckIn>('/safety-check-ins', { method: 'POST', body: JSON.stringify(payload) }),
  removeSafetyCheckIn: (id: string, deleteToken: string) => request<{ removed: boolean }>(`/safety-check-ins/${id}`, { method: 'DELETE', body: JSON.stringify({ deleteToken }) }),
}
