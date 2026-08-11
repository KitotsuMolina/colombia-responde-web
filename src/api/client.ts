import type { ApiIncident, ApiLocation, ApiMissingPerson, ReportKind } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

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
  createIncident: (payload: {
    kind: ReportKind; title: string; description: string; location: ApiLocation
    longitude: number; latitude: number; peopleAtRisk?: number
  }) => request<ApiIncident>('/incidents', { method: 'POST', body: JSON.stringify(payload) }),
  people: (query = '') => request<ApiMissingPerson[]>(`/missing-persons${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  createPerson: (payload: {
    fullName: string; age?: number; location: ApiLocation; lastSeenAt: string
    lastSeenDetails: string; contactToken: string
  }) => request<ApiMissingPerson>('/missing-persons', { method: 'POST', body: JSON.stringify(payload) }),
}
