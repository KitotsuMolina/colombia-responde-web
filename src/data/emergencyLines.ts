export type EmergencyLine = { name: string; number: string; purpose: string; primary?: boolean }
export type EmergencyDirectory = { id: string; label: string; department: string; verifiedAt: string; sourceUrl: string; lines: EmergencyLine[] }

export const emergencyDirectories: EmergencyDirectory[] = [
  {
    id: 'national', label: 'Colombia', department: 'Nacional', verifiedAt: '2026-08-11',
    sourceUrl: 'https://portal.gestiondelriesgo.gov.co/Paginas/El-riesgo-no-se-va-de-vacaciones.aspx',
    lines: [
      { name:'Emergencias y Policía', number:'123', purpose:'Línea nacional de emergencias', primary:true },
      { name:'Bomberos', number:'119', purpose:'Incendios, rescates y emergencias' },
      { name:'Cruz Roja', number:'132', purpose:'Atención humanitaria y emergencias' },
      { name:'Defensa Civil', number:'144', purpose:'Emergencias y apoyo en desastres' },
      { name:'Estado de las vías', number:'#767', purpose:'Información y emergencias viales' },
    ],
  },
  {
    id: 'cali', label: 'Santiago de Cali', department: 'Valle del Cauca', verifiedAt: '2026-08-11',
    sourceUrl: 'https://normagrama.cali.gov.co/compilacion/docs/d_alcacali_0457_2025.htm',
    lines: [
      { name:'Línea única de emergencias', number:'123', purpose:'HEXA: atención coordinada en Cali', primary:true },
      { name:'Bomberos', number:'119', purpose:'Incendios, rescates y emergencias' },
      { name:'Cruz Roja', number:'132', purpose:'Atención humanitaria y emergencias' },
      { name:'Defensa Civil', number:'144', purpose:'Emergencias y apoyo en desastres' },
      { name:'Movilidad', number:'127', purpose:'Tránsito y movilidad en Cali' },
    ],
  },
]

export const directoryForCoordinates = (latitude: number, longitude: number) =>
  latitude >= 3.2 && latitude <= 3.7 && longitude >= -76.8 && longitude <= -76.3 ? 'cali' : 'national'
