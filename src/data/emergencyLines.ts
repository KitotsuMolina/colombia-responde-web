export type EmergencyLine = { name: string; number: string; purpose: string; primary?: boolean }
export type EmergencyDirectory = {
  id: string; label: string; department: string; verifiedAt: string; sourceUrl: string
  coverageNote?: string; center?: [number, number]; radiusKm?: number; lines: EmergencyLine[]
}

const coreLines: EmergencyLine[] = [
  { name:'Emergencias y Policía', number:'123', purpose:'Línea nacional de emergencias', primary:true },
  { name:'Bomberos', number:'119', purpose:'Incendios, rescates y emergencias' },
  { name:'Cruz Roja', number:'132', purpose:'Atención humanitaria y emergencias' },
  { name:'Defensa Civil', number:'144', purpose:'Emergencias y apoyo en desastres' },
]

export const emergencyDirectories: EmergencyDirectory[] = [
  {
    id:'national', label:'Colombia', department:'Nacional', verifiedAt:'2026-08-11',
    sourceUrl:'https://portal.gestiondelriesgo.gov.co/Paginas/El-riesgo-no-se-va-de-vacaciones.aspx',
    lines:[...coreLines,{ name:'Estado de las vías', number:'#767', purpose:'Información y emergencias viales' }],
  },
  {
    id:'cali', label:'Santiago de Cali', department:'Valle del Cauca', verifiedAt:'2026-08-11', center:[3.4516,-76.532], radiusKm:35,
    sourceUrl:'https://normagrama.cali.gov.co/compilacion/docs/d_alcacali_0457_2025.htm',
    lines:[
      { name:'Línea única de emergencias', number:'123', purpose:'HEXA: atención coordinada en Cali', primary:true },
      { name:'Bomberos', number:'119', purpose:'Incendios, rescates y ambulancia' },
      { name:'Cruz Roja', number:'132', purpose:'Atención humanitaria y emergencias' },
      { name:'Defensa Civil', number:'144', purpose:'Emergencias y apoyo en desastres' },
      { name:'EMCALI', number:'117', purpose:'Servicios públicos' },
      { name:'Fugas de gas', number:'164', purpose:'Emergencias de gas' },
      { name:'Movilidad', number:'127', purpose:'Tránsito y movilidad en Cali' },
    ],
  },
  {
    id:'pereira', label:'Pereira', department:'Risaralda', verifiedAt:'2026-08-11', center:[4.8143,-75.6946], radiusKm:18,
    sourceUrl:'https://www.pereira.gov.co/publicaciones/10419/cuerpo-oficial-de-bomberos-y-diger-atienden-emergencias-ocasionadas-por-vendaval-en-pereira/',
    lines:[...coreLines,{ name:'Bomberos Pereira', number:'315 683 3300', purpose:'Línea alterna oficial' }],
  },
  {
    id:'dosquebradas', label:'Dosquebradas', department:'Risaralda', verifiedAt:'2026-08-11', center:[4.8392,-75.6673], radiusKm:8,
    sourceUrl:'https://diger.dosquebradas.gov.co/?catid=2&id=26%3Arecuerda-tener-siempre-a-la-mano-los-numeros-de-emergencia&view=article',
    lines:[
      ...coreLines,
      { name:'Bomberos Dosquebradas', number:'606 343 9119', purpose:'Línea local alterna' },
      { name:'Cruz Roja Risaralda', number:'316 478 1801', purpose:'Línea local alterna' },
      { name:'Defensa Civil Risaralda', number:'313 336 4324', purpose:'Línea local alterna' },
      { name:'Energía de Pereira', number:'115', purpose:'Emergencias de energía' },
    ],
  },
  {
    id:'manizales', label:'Manizales', department:'Caldas', verifiedAt:'2026-08-11', center:[5.0703,-75.5138], radiusKm:25,
    sourceUrl:'https://centrodeinformacion.manizales.gov.co/wp-content/uploads/2025/12/Programacion-baja-dic-19.pdf',
    lines:[
      ...coreLines,
      { name:'Emergencias médicas', number:'123', purpose:'Selecciona la opción 2' },
      { name:'Bomberos Fundadores', number:'606 863 2757', purpose:'Línea fija alterna' },
      { name:'Bomberos', number:'606 863 2758', purpose:'Línea fija alterna' },
      { name:'Bomberos', number:'606 863 2759', purpose:'Línea fija alterna' },
      { name:'Bomberos', number:'606 863 2762', purpose:'Línea fija alterna' },
      { name:'Tránsito', number:'606 891 8494', purpose:'Movilidad municipal' },
      { name:'Rescate SER-BYR', number:'305 330 1515', purpose:'Búsqueda, rescate y paramédicos' },
    ],
  },
  {
    id:'armenia', label:'Armenia', department:'Quindío', verifiedAt:'2026-08-11', center:[4.5339,-75.6811], radiusKm:24,
    sourceUrl:'https://www.armenia.gov.co/omgerd-monitorea-emergencias-por-lluvias-en-armenia-4',
    lines:[
      ...coreLines,
      { name:'Bomberos Armenia', number:'316 233 2682', purpose:'WhatsApp y llamadas' },
      { name:'EPA', number:'116', purpose:'Agua y alcantarillado' },
      { name:'EDEQ', number:'115', purpose:'Emergencias de energía' },
      { name:'Efigas', number:'164', purpose:'Emergencias de gas' },
      { name:'Estado de las vías', number:'#767', purpose:'Información y emergencias viales' },
    ],
  },
  {
    id:'quibdo', label:'Quibdó', department:'Chocó', verifiedAt:'2026-08-11', center:[5.6947,-76.6611], radiusKm:30,
    sourceUrl:'https://codechoco.gov.co/publicaciones/4037/alerta-hidrometeorologica-en-el-choco-por-intensas-lluvias-y-alto-riesgo-de-inundaciones-y-deslizamientos/',
    coverageNote:'Los teléfonos móviles corresponden a organismos con cobertura departamental.',
    lines:[
      ...coreLines,
      { name:'Cruz Roja Chocó', number:'321 897 9067', purpose:'Contacto departamental' },
      { name:'Bomberos Chocó', number:'313 753 0868', purpose:'Contacto departamental' },
      { name:'Defensa Civil Chocó', number:'310 330 5140', purpose:'Contacto departamental' },
      { name:'Defensa Civil Chocó', number:'311 356 2952', purpose:'Contacto alternativo' },
      { name:'CODECHOCÓ', number:'310 849 1166', purpose:'Emergencias ambientales' },
    ],
  },
  {
    id:'san-jose-del-palmar', label:'San José del Palmar', department:'Chocó', verifiedAt:'2026-08-11', center:[4.9735,-76.2289], radiusKm:22,
    sourceUrl:'https://codechoco.gov.co/publicaciones/4037/alerta-hidrometeorologica-en-el-choco-por-intensas-lluvias-y-alto-riesgo-de-inundaciones-y-deslizamientos/',
    coverageNote:'No se encontró un directorio municipal reciente; se muestran líneas nacionales y departamentales de Chocó.',
    lines:[
      ...coreLines,
      { name:'Cruz Roja Chocó', number:'321 897 9067', purpose:'Cobertura departamental' },
      { name:'Bomberos Chocó', number:'313 753 0868', purpose:'Cobertura departamental' },
      { name:'Defensa Civil Chocó', number:'310 330 5140', purpose:'Cobertura departamental' },
      { name:'Defensa Civil Chocó', number:'311 356 2952', purpose:'Contacto alternativo' },
    ],
  },
  {
    id:'cartago', label:'Cartago', department:'Valle del Cauca', verifiedAt:'2026-08-11', center:[4.7464,-75.9117], radiusKm:22,
    sourceUrl:'https://cartago.gov.co/documentos_acordeon/Plan%20de%20Respuesta%20-%20CONTINGENCIA%20ante%20la%20Primera%20Temporada%20de%20Lluvias%20del%202024%20en%20Cartago%20%282%29.pdf',
    lines:[
      ...coreLines,
      { name:'Bomberos Cartago', number:'606 213 7036', purpose:'Línea local alterna' },
      { name:'CRAE', number:'125', purpose:'Ambulancias y emergencias' },
      { name:'CRAE', number:'350 888 7993', purpose:'Contacto alternativo' },
      { name:'Defensa Civil', number:'350 252 5589', purpose:'Contacto local' },
      { name:'Gestión del Riesgo', number:'313 768 8615', purpose:'Contacto municipal' },
    ],
  },
  {
    id:'el-cairo', label:'El Cairo', department:'Valle del Cauca', verifiedAt:'2026-08-11', center:[4.7606,-76.221], radiusKm:18,
    sourceUrl:'https://portal.gestiondelriesgo.gov.co/Paginas/El-riesgo-no-se-va-de-vacaciones.aspx',
    coverageNote:'Directorio municipal pendiente de confirmación; se muestran únicamente líneas nacionales verificadas.',
    lines:coreLines,
  },
]

const distanceKm = (latitude: number, longitude: number, center: [number,number]) => {
  const radians=(value:number)=>value*Math.PI/180
  const deltaLatitude=radians(center[0]-latitude),deltaLongitude=radians(center[1]-longitude)
  const a=Math.sin(deltaLatitude/2)**2+Math.cos(radians(latitude))*Math.cos(radians(center[0]))*Math.sin(deltaLongitude/2)**2
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

export const directoryForCoordinates = (latitude: number, longitude: number) => {
  const nearby=emergencyDirectories.filter(item=>item.center&&distanceKm(latitude,longitude,item.center)<=(item.radiusKm??20))
    .sort((a,b)=>distanceKm(latitude,longitude,a.center!)-distanceKm(latitude,longitude,b.center!))
  return nearby[0]?.id??'national'
}
