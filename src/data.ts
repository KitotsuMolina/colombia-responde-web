import type { Incident, MissingPerson } from './types'

export const incidents: Incident[] = [
  { id: 'COL-0241', kind: 'help', title: 'Vivienda afectada', place: 'Cali · Valle del Cauca', description: 'Posibles personas dentro. Acceso limitado.', time: 'Hace 4 min', verification: 'community', x: 23, y: 56, people: 2 },
  { id: 'COL-0238', kind: 'landslide', title: 'Deslizamiento', place: 'Manizales · Caldas', description: 'Paso peatonal cerrado por tierra y rocas.', time: 'Hace 7 min', verification: 'evidence', x: 42, y: 43 },
  { id: 'COL-0233', kind: 'water', title: 'Agua disponible', place: 'Pereira · Risaralda', description: 'Punto comunitario. Llevar recipiente.', time: 'Hace 11 min', verification: 'verified', x: 34, y: 46 },
  { id: 'COL-0229', kind: 'medical', title: 'Puesto de primeros auxilios', place: 'Quibdó · Chocó', description: 'Atención básica y clasificación inicial.', time: 'Hace 18 min', verification: 'verified', x: 26, y: 31 },
  { id: 'COL-0221', kind: 'road', title: 'Vía bloqueada', place: 'Armenia · Quindío', description: 'No hay paso vehicular.', time: 'Hace 24 min', verification: 'community', x: 43, y: 50 },
]

export const people: MissingPerson[] = [
  { id: 'P-104', name: 'Lucía Andrea Torres', age: 34, place: 'Cali · Valle del Cauca', lastSeen: '10 ago · 19:20', status: 'missing', initials: 'LT' },
  { id: 'P-099', name: 'Carlos Medina Ruiz', age: 61, place: 'Manizales · Caldas', lastSeen: '10 ago · 18:45', status: 'sighting', initials: 'CM' },
  { id: 'P-087', name: 'Samuel Rojas', age: 12, place: 'Pereira · Risaralda', lastSeen: 'Localizado · 23:12', status: 'located', initials: 'SR' },
]
