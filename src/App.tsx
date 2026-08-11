import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, CircleHelp, Clock3, HeartHandshake, House, LoaderCircle, MapPin, Menu, Navigation, PackageOpen, Search, ShieldCheck, Siren, UserRoundSearch, Users, Wifi, WifiOff, X } from 'lucide-react'
import { api } from './api/client'
import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { ApiIncident, ApiLocation, ApiMissingPerson, ApiSafetyCheckIn, Incident, MissingPerson, ReportKind } from './types'
import { directoryForCoordinates, emergencyDirectories } from './data/emergencyLines'

type View = 'home' | 'report' | 'people' | 'safety' | 'emergency-lines'
type Coordinates = { latitude: number; longitude: number }

const isInAppBrowser = () => /Instagram|FBAN|FBAV|WhatsApp/i.test(navigator.userAgent)
const geolocationMessage = (error?: GeolocationPositionError) => {
  if (isInAppBrowser()) return 'El navegador interno de WhatsApp puede bloquear el GPS. Abre esta página en Safari o selecciona el punto manualmente en el mapa.'
  if (error?.code === 1) return 'El permiso de ubicación está bloqueado. Actívalo en los ajustes del navegador o selecciona el punto manualmente en el mapa.'
  if (error?.code === 3) return 'La ubicación tardó demasiado. Inténtalo otra vez o selecciona el punto manualmente en el mapa.'
  return 'No pudimos obtener tu ubicación. Puedes seleccionar el punto manualmente en el mapa.'
}
const requestCoordinates = (success: (coordinates: Coordinates) => void, failure: (message: string) => void) => {
  if (!navigator.geolocation) return failure('Este navegador no permite usar el GPS. Selecciona el punto manualmente en el mapa.')
  navigator.geolocation.getCurrentPosition(
    position => success({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
    error => failure(geolocationMessage(error)),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
  )
}

const kindMeta: Record<ReportKind, { label: string; icon: typeof Siren; tone: string }> = {
  help: { label: 'Ayuda urgente', icon: Siren, tone: 'red' }, damage: { label: 'Daño estructural', icon: House, tone: 'orange' },
  landslide: { label: 'Deslizamiento', icon: AlertTriangle, tone: 'orange' }, road: { label: 'Vía bloqueada', icon: Navigation, tone: 'yellow' },
  water: { label: 'Agua disponible', icon: PackageOpen, tone: 'green' }, power: { label: 'Sin electricidad', icon: AlertTriangle, tone: 'yellow' },
  medical: { label: 'Punto médico', icon: HeartHandshake, tone: 'green' }, shelter: { label: 'Albergue', icon: House, tone: 'green' },
  aid: { label: 'Punto de ayuda', icon: PackageOpen, tone: 'green' },
}

const blankLocation: ApiLocation = { departmentCode: '', departmentName: '', municipalityCode: '', municipalityName: '', locality: '' }
const timeAgo = (date: string) => new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(-Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000)), 'minute')
const mapIncident = (item: ApiIncident): Incident => {
  const [longitude, latitude] = item.coordinates.coordinates
  return { id: item.id.slice(0, 8).toUpperCase(), kind: item.kind, title: item.title, description: item.description,
    place: `${item.location.municipalityName} · ${item.location.departmentName}`, time: timeAgo(item.createdAt),
    verification: item.verificationStatus, people: item.peopleAtRisk,
    x: Math.min(90, Math.max(10, ((longitude + 79) / 13) * 80 + 10)), y: Math.min(90, Math.max(10, ((13 - latitude) / 17) * 80 + 10)), latitude, longitude }
}
const mapPerson = (item: ApiMissingPerson): MissingPerson => ({ id: item.id, name: item.fullName, age: item.age,
  place: `${item.location.municipalityName} · ${item.location.departmentName}`, lastSeen: new Date(item.lastSeenAt).toLocaleString('es-CO'),
  status: item.status, initials: item.fullName.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() })

function Header({ onHome, onEmergency, online }: { onHome: () => void; onEmergency: () => void; online: boolean }) {
  const [open, setOpen] = useState(false)
  return <header className="topbar"><button className="brand" onClick={onHome}><span className="brand-mark">CR</span><span>Colombia<br/><b>Responde</b></span></button>
    <div className={`network ${online ? '' : 'offline'}`}>{online ? <Wifi size={15}/> : <WifiOff size={15}/>} {online ? 'API conectada' : 'Sin conexión'}</div>
    <button className="icon-button" onClick={() => setOpen(!open)} aria-label="Abrir menú"><Menu/></button>
    {open && <div className="header-menu"><button onClick={() => { onHome(); setOpen(false) }}>Inicio</button><button onClick={() => { onEmergency(); setOpen(false) }}>Líneas de emergencia</button><a href="tel:123">Llamar al 123</a><button onClick={() => setOpen(false)}>Cerrar</button></div>}
  </header>
}

function EmergencyLinesPage({ close, coordinates }: { close: () => void; coordinates?: Coordinates }) {
  const suggested=coordinates?directoryForCoordinates(coordinates.latitude,coordinates.longitude):'national'
  const [region,setRegion]=useState(suggested)
  const directory=emergencyDirectories.find(item=>item.id===region)??emergencyDirectories[0]
  return <main className="form-page emergency-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">DIRECTORIO TERRITORIAL</span><h1>Líneas de emergencia</h1><p>Los números pueden cambiar según la ciudad. Selecciona tu territorio y llama solamente si necesitas atención real.</p>
    <label>Territorio<select value={region} onChange={event=>setRegion(event.target.value)}>{emergencyDirectories.map(item=><option value={item.id} key={item.id}>{item.label} · {item.department}</option>)}</select></label>
    <div className="emergency-list">{directory.lines.map(line=><a className={line.primary?'primary-line':''} href={`tel:${line.number}`} key={`${directory.id}-${line.number}`}><span><b>{line.name}</b><small>{line.purpose}</small></span><strong>{line.number}</strong></a>)}</div>
    <div className="public-note emergency-source"><ShieldCheck/><div><b>Información territorial verificada</b><p>Revisada el {new Date(`${directory.verifiedAt}T12:00:00`).toLocaleDateString('es-CO')}. <a href={directory.sourceUrl} target="_blank" rel="noreferrer">Consultar fuente oficial</a>.</p></div></div>
  </main>
}

function Hero({ setView }: { setView: (v: View) => void }) {
  return <section className="hero"><div className="eyebrow"><span className="pulse"/> RED CIUDADANA DE EMERGENCIA</div><h1>Ayuda que encuentra<br/><em>a quien la necesita.</em></h1>
    <p>Reporta emergencias, encuentra personas y consulta recursos disponibles en todo Colombia.</p><div className="hero-actions">
      <button className="primary danger" onClick={() => setView('report')}><Siren/> Necesito ayuda</button>
      <button className="primary safe" onClick={() => setView('safety')}><CheckCircle2/> Estoy bien</button></div>
  </section>
}

function MapRecenter({ coordinates }: { coordinates?: Coordinates }) {
  const map = useMap()
  useEffect(() => { if (coordinates) map.flyTo([coordinates.latitude,coordinates.longitude],12,{duration:1.2}) }, [coordinates,map])
  return null
}

function MapPanel({ items, onLocate, userCoordinates }: { items: Incident[]; onLocate: () => void; userCoordinates?: Coordinates }) {
  return <section className="map-card"><div className="map-head"><div><span className="section-kicker">SITUACIÓN ACTUAL</span><h2>Mapa ciudadano</h2></div><span className="region"><MapPin size={15}/> Colombia <ChevronDown size={14}/></span></div>
    <div className="map-canvas leaflet-map"><MapContainer center={[4.5709,-74.2973]} zoom={5} minZoom={4} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <MapRecenter coordinates={userCoordinates}/>{userCoordinates&&<Marker position={[userCoordinates.latitude,userCoordinates.longitude]}><Popup><b>Tu ubicación aproximada</b></Popup></Marker>}
      {items.map(item => { const meta=kindMeta[item.kind]; return <Marker key={item.id} position={[item.latitude,item.longitude]} icon={divIcon({className:'leaflet-report-icon',html:`<span class="leaflet-marker ${meta.tone}"></span>`,iconSize:[30,30],iconAnchor:[15,15]})}><Popup><b>{item.title}</b><br/>{item.place}<br/><small>{item.time} · {item.verification==='official'?'Fuente oficial':'Reporte ciudadano'}</small></Popup></Marker> })}
    </MapContainer>{!items.length&&<div className="empty-map">No hay reportes para este filtro</div>}<button className="locate" onClick={onLocate} aria-label="Obtener ubicación"><Navigation size={18}/></button></div>
    <div className="legend"><span><i className="dot red"/> Urgente</span><span><i className="dot orange"/> Daño</span><span><i className="dot green"/> Recurso</span></div></section>
}

function Feed({ items, loading, onAll }: { items: Incident[]; loading: boolean; onAll: () => void }) {
  return <section className="feed"><div className="section-row"><div><span className="section-kicker">EN LA COMUNIDAD</span><h2>Reportes recientes</h2></div><button onClick={onAll}>Ver todos</button></div>
    {loading && <div className="loading"><LoaderCircle/> Cargando reportes…</div>}<div className="report-list">{items.map(item => { const meta=kindMeta[item.kind]; const Icon=meta.icon; return <article className="report" key={item.id}><div className={`report-icon ${meta.tone}`}><Icon/></div><div className="report-body"><div className="report-title"><h3>{item.title}</h3><span>{item.id}</span></div><p><MapPin size={14}/>{item.place}</p><div className="report-meta"><span><Clock3 size={13}/>{item.time}</span><span className={`verification ${item.verification}`}><ShieldCheck size={13}/>{item.verification==='verified'?'Verificado':item.verification==='official'?'Fuente oficial':item.verification==='community'?'Confirmación comunitaria':'Sin verificar'}</span></div></div></article>})}</div>
  </section>
}

function LocationPicker({ coordinates, onChange }: { coordinates?: Coordinates; onChange: (value: Coordinates) => void }) {
  function ClickHandler() { useMapEvents({ click: event => onChange({ latitude:event.latlng.lat, longitude:event.latlng.lng }) }); return null }
  return <div className="manual-map"><MapContainer center={coordinates ? [coordinates.latitude,coordinates.longitude] : [4.5709,-74.2973]} zoom={coordinates ? 15 : 5} scrollWheelZoom>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <ClickHandler/>{coordinates&&<Marker position={[coordinates.latitude,coordinates.longitude]}/>} 
  </MapContainer><small>Toca el mapa para marcar la ubicación exacta.</small></div>
}

function LocationFields({ value, onChange, coordinates, setCoordinates }: { value: ApiLocation; onChange: (v: ApiLocation) => void; coordinates?: Coordinates; setCoordinates?: (v: Coordinates) => void }) {
  const [locationError,setLocationError]=useState('')
  const locate = () => { setLocationError(''); requestCoordinates(value => setCoordinates?.(value), setLocationError) }
  const field = (key: keyof ApiLocation, placeholder: string, maxLength?: number) => <input required value={value[key] || ''} maxLength={maxLength} placeholder={placeholder} onChange={e => onChange({ ...value, [key]:e.target.value })}/>
  return <div className="location-fields"><div>{field('departmentName','Departamento')}{field('departmentCode','Código DANE (2 dígitos)',2)}</div><div>{field('municipalityName','Municipio o distrito')}{field('municipalityCode','Código DANE (5 dígitos)',5)}</div>{field('locality','Barrio, vereda o localidad')}{setCoordinates&&<><button type="button" className="outline full" onClick={locate}><Navigation/> {coordinates ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}` : 'Usar ubicación GPS'}</button>{locationError&&<div className="location-error" role="alert"><AlertTriangle/>{locationError}</div>}<LocationPicker coordinates={coordinates} onChange={value=>{setLocationError('');setCoordinates(value)}}/></>}</div>
}

function SafetyPage({ close }: { close: () => void }) {
  const [mode,setMode]=useState<'create'|'search'>('create'),[fullName,setFullName]=useState(''),[location,setLocation]=useState<ApiLocation>(blankLocation),[message,setMessage]=useState(''),[coordinates,setCoordinates]=useState<Coordinates>(),[sending,setSending]=useState(false),[error,setError]=useState(''),[created,setCreated]=useState<ApiSafetyCheckIn>(),[query,setQuery]=useState(''),[results,setResults]=useState<ApiSafetyCheckIn[]>([])
  const submit=async(e:FormEvent)=>{e.preventDefault();setSending(true);setError('');try{const item=await api.createSafetyCheckIn({fullName,location,message:message||undefined,latitude:coordinates?.latitude,longitude:coordinates?.longitude});setCreated(item);if(item.deleteToken)localStorage.setItem(`safety-delete-${item.id}`,item.deleteToken)}catch(err){setError(err instanceof Error?err.message:'No fue posible confirmar tu estado')}finally{setSending(false)}}
  const search=async(e:FormEvent)=>{e.preventDefault();setSending(true);setError('');try{setResults(await api.safetyCheckIns(query))}catch(err){setError(err instanceof Error?err.message:'No fue posible buscar')}finally{setSending(false)}}
  const remove=async(item:ApiSafetyCheckIn)=>{const token=localStorage.getItem(`safety-delete-${item.id}`);if(!token)return;await api.removeSafetyCheckIn(item.id,token);localStorage.removeItem(`safety-delete-${item.id}`);setResults(current=>current.filter(result=>result.id!==item.id))}
  if(created)return <main className="form-page success-page"><CheckCircle2/><h1>{created.fullName} está bien</h1><p>Confirmación autodeclarada registrada. Comparte este código para que puedan encontrarte sin publicar tu ubicación exacta.</p><b>{created.publicCode}</b><p>{created.location.municipalityName} · {created.location.departmentName}<br/>{new Date(created.createdAt).toLocaleString('es-CO')}</p><button className="primary safe full" onClick={()=>{setQuery(created.publicCode);setMode('search');setCreated(undefined)}}>Consultar confirmación</button><button className="back" onClick={close}>Volver al inicio</button></main>
  return <main className="form-page safety-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">CONFIRMACIÓN DE SEGURIDAD</span><h1>{mode==='create'?'Informar que estás bien':'Buscar confirmación'}</h1><div className="mode-tabs"><button className={mode==='create'?'active':''} onClick={()=>setMode('create')}>Estoy bien</button><button className={mode==='search'?'active':''} onClick={()=>setMode('search')}>Buscar a alguien</button></div>
    {mode==='create'?<form onSubmit={submit}><p>Publicaremos tu nombre, municipio, hora y mensaje. Las coordenadas exactas no se muestran.</p><label>Nombre completo<input required minLength={3} maxLength={180} value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label>Ubicación aproximada<LocationFields value={location} onChange={setLocation} coordinates={coordinates} setCoordinates={setCoordinates}/></label><label>Mensaje opcional<textarea maxLength={500} rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Estoy con mi familia y en un lugar seguro."/></label><div className="privacy"><ShieldCheck/><p><b>Confirmación autodeclarada</b><br/>Caduca automáticamente en 30 días. Conservaremos en este dispositivo un token para eliminarla.</p></div>{error&&<p className="form-error">{error}</p>}<button disabled={sending} className="primary safe full">{sending?<><LoaderCircle/> Guardando…</>:'Confirmar que estoy bien'}</button></form>
    :<><form onSubmit={search}><div className="searchbox"><Search/><input required minLength={2} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre o código BIEN-…"/></div><button disabled={sending} className="primary safe full">{sending?'Buscando…':'Buscar confirmación'}</button></form>{error&&<p className="form-error">{error}</p>}<div className="safety-results">{results.map(item=><article className="safety-result" key={item.id}><CheckCircle2/><div><h3>{item.fullName} está bien</h3><p>{item.location.municipalityName} · {item.location.departmentName}</p><small>{new Date(item.createdAt).toLocaleString('es-CO')} · {item.status==='verified'?'Verificada':'Autodeclarada'} · {item.publicCode}</small>{item.message&&<blockquote>{item.message}</blockquote>}</div>{localStorage.getItem(`safety-delete-${item.id}`)&&<button onClick={()=>void remove(item)}>Eliminar mi confirmación</button>}</article>)}</div>{!sending&&results.length===0&&query&&<p className="empty-state">Realiza la búsqueda para consultar confirmaciones activas.</p>}</>}
  </main>
}

function ReportForm({ close, onCreated, initialCoordinates }: { close: () => void; onCreated: (i: ApiIncident) => void; initialCoordinates?: Coordinates }) {
  const [kind,setKind]=useState<ReportKind>('help'), [location,setLocation]=useState<ApiLocation>(blankLocation), [coordinates,setCoordinates]=useState<Coordinates|undefined>(initialCoordinates)
  const [title,setTitle]=useState(''), [description,setDescription]=useState(''), [peopleAtRisk,setPeopleAtRisk]=useState(''), [sending,setSending]=useState(false), [error,setError]=useState(''), [sent,setSent]=useState<ApiIncident>()
  const submit=async(e:FormEvent)=>{e.preventDefault();if(!coordinates){setError('Captura la ubicación GPS antes de enviar.');return}setSending(true);setError('');try{const created=await api.createIncident({kind,title,description,location,latitude:coordinates.latitude,longitude:coordinates.longitude,peopleAtRisk:peopleAtRisk?Number(peopleAtRisk):undefined});setSent(created);onCreated(created)}catch(err){setError(err instanceof Error?err.message:'No fue posible enviar el reporte')}finally{setSending(false)}}
  if(sent)return <main className="form-page success-page"><CheckCircle2/><h1>Reporte registrado</h1><p>La API confirmó el reporte. Su estado inicial es “sin verificar”.</p><b>#{sent.id.slice(0,8).toUpperCase()}</b><button className="primary safe" onClick={close}>Volver al mapa</button></main>
  return <main className="form-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">NUEVO REPORTE</span><h1>¿Qué está ocurriendo?</h1><p>Si existe peligro inmediato, aléjate de la zona y contacta al 123.</p><form onSubmit={submit}>
    <div className="kind-grid">{(Object.entries(kindMeta) as [ReportKind,typeof kindMeta[ReportKind]][]).map(([key,meta])=>{const Icon=meta.icon;return <button type="button" className={kind===key?'selected':''} onClick={()=>setKind(key)} key={key}><Icon/><span>{meta.label}</span></button>})}</div>
    <label>Título<input required minLength={3} maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej. Vivienda afectada"/></label><label>Ubicación territorial<LocationFields value={location} onChange={setLocation} coordinates={coordinates} setCoordinates={setCoordinates}/></label>
    <label>Personas en riesgo<input min={0} max={10000} type="number" value={peopleAtRisk} onChange={e=>setPeopleAtRisk(e.target.value)} placeholder="Opcional"/></label><label>Cuéntanos lo esencial<textarea required minLength={5} maxLength={2000} value={description} onChange={e=>setDescription(e.target.value)} rows={4}/></label>
    <div className="privacy"><ShieldCheck/><p><b>Publica con cuidado</b><br/>No incluyas teléfonos, documentos ni información médica.</p></div>{error&&<p className="form-error">{error}</p>}<button disabled={sending} className="primary danger full">{sending?<><LoaderCircle/> Enviando…</>:'Enviar reporte'}</button></form></main>
}

function PeoplePage({ close }: { close: () => void }) {
  const [query,setQuery]=useState(''), [people,setPeople]=useState<MissingPerson[]>([]), [loading,setLoading]=useState(true), [creating,setCreating]=useState(false), [error,setError]=useState('')
  const [fullName,setFullName]=useState(''), [age,setAge]=useState(''), [lastSeenAt,setLastSeenAt]=useState(''), [details,setDetails]=useState(''), [location,setLocation]=useState<ApiLocation>(blankLocation)
  const load=useCallback(async()=>{setLoading(true);try{setPeople((await api.people(query)).map(mapPerson));setError('')}catch(err){setError(err instanceof Error?err.message:'Error de conexión')}finally{setLoading(false)}},[query])
  useEffect(()=>{const timer=setTimeout(()=>void load(),300);return()=>clearTimeout(timer)},[load])
  const submit=async(e:FormEvent)=>{e.preventDefault();setLoading(true);try{await api.createPerson({fullName,age:age?Number(age):undefined,location,lastSeenAt:new Date(lastSeenAt).toISOString(),lastSeenDetails:details,contactToken:crypto.randomUUID()});setCreating(false);setFullName('');setAge('');setDetails('');await load()}catch(err){setError(err instanceof Error?err.message:'No fue posible registrar a la persona');setLoading(false)}}
  return <main className="form-page people-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">REUNIFICACIÓN FAMILIAR</span><h1>{creating?'Reportar una persona':'Buscar una persona'}</h1>
    {!creating?<><p>Consulta la base ciudadana por nombre.</p><div className="searchbox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre de la persona"/>{query&&<button onClick={()=>setQuery('')}><X/></button>}</div><button className="outline full" onClick={()=>setCreating(true)}><UserRoundSearch/> Reportar persona desaparecida</button>{loading&&<div className="loading"><LoaderCircle/> Buscando…</div>}{error&&<p className="form-error">{error}</p>}<div className="people-list">{people.map(person=><article className="person" key={person.id}><div className="avatar">{person.initials}</div><div><h3>{person.name}{person.age!==undefined?`, ${person.age}`:''}</h3><p><MapPin size={13}/>{person.place}</p><small>{person.lastSeen}</small></div><span className={`person-status ${person.status}`}>{person.status==='missing'?'Desaparecida':person.status==='sighting'?'Avistamiento':'Localizada'}</span></article>)}</div>{!loading&&!people.length&&<p className="empty-state">No se encontraron personas con ese nombre.</p>}</>
    :<form onSubmit={submit}><label>Nombre completo<input required minLength={3} value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label>Edad aproximada<input type="number" min={0} max={125} value={age} onChange={e=>setAge(e.target.value)}/></label><label>Último contacto<input required type="datetime-local" value={lastSeenAt} onChange={e=>setLastSeenAt(e.target.value)}/></label><label>Ubicación territorial<LocationFields value={location} onChange={setLocation}/></label><label>Detalles<textarea required minLength={5} maxLength={2000} value={details} onChange={e=>setDetails(e.target.value)} rows={4}/></label>{error&&<p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="outline" onClick={()=>setCreating(false)}>Cancelar</button><button disabled={loading} className="primary danger">Registrar</button></div></form>}
  </main>
}

export default function App(){const[view,setView]=useState<View>('home'),[filter,setFilter]=useState<'all'|'urgent'|'resources'>('all'),[incidents,setIncidents]=useState<Incident[]>([]),[loading,setLoading]=useState(true),[online,setOnline]=useState(false),[coordinates,setCoordinates]=useState<Coordinates>(),[locationError,setLocationError]=useState('')
  const load=useCallback(async()=>{setLoading(true);try{const[data]=await Promise.all([api.incidents(),api.health()]);setIncidents(data.map(mapIncident));setOnline(true)}catch{setOnline(false)}finally{setLoading(false)}},[])
  useEffect(()=>{void load()},[load]);const visible=useMemo(()=>incidents.filter(i=>filter==='all'||(filter==='urgent'?['help','damage','landslide'].includes(i.kind):['water','medical','shelter','aid'].includes(i.kind))),[filter,incidents])
  const locate=()=>{setLocationError('');requestCoordinates(value=>{setCoordinates(value);setView('report')},setLocationError)}
  const locateOnMap=()=>{setLocationError('');requestCoordinates(setCoordinates,setLocationError)}
  const created=(item:ApiIncident)=>{setIncidents(current=>[mapIncident(item),...current]);setOnline(true)}
  const header=<Header onHome={()=>setView('home')} onEmergency={()=>setView('emergency-lines')} online={online}/>
  if(view==='safety')return <div className="app">{header}<SafetyPage close={()=>setView('home')}/><footer><div className="brand-mark">CR</div><p>Colombia Responde<br/><small>Tecnología abierta para ayudarnos.</small></p></footer></div>
  if(view==='emergency-lines')return <div className="app">{header}<EmergencyLinesPage close={()=>setView('home')} coordinates={coordinates}/><footer><div className="brand-mark">CR</div><p>Colombia Responde<br/><small>Tecnología abierta para ayudarnos.</small></p></footer></div>
  return <div className="app">{header}{view==='report'?<ReportForm close={()=>setView('home')} onCreated={created} initialCoordinates={coordinates}/>:view==='people'?<PeoplePage close={()=>setView('home')}/>:<><Hero setView={setView}/><button className="location global-location" onClick={locate}><MapPin size={17}/> Usar mi ubicación para reportar <span>›</span></button>{locationError&&<div className="location-error home-location-error" role="alert"><AlertTriangle/><span>{locationError}<button onClick={()=>setView('report')}>Seleccionar en el mapa</button></span></div>}<nav className="quick-actions"><button onClick={()=>setView('people')}><UserRoundSearch/><span><b>Buscar persona</b><small>Desaparecidos y localizados</small></span></button><button onClick={()=>setView('report')}><House/><span><b>Reportar daño</b><small>Viviendas, vías y servicios</small></span></button></nav><div className="filterbar"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Todos</button><button className={filter==='urgent'?'active':''} onClick={()=>setFilter('urgent')}>Urgentes</button><button className={filter==='resources'?'active':''} onClick={()=>setFilter('resources')}>Ayuda disponible</button></div><MapPanel items={visible} onLocate={locateOnMap} userCoordinates={coordinates}/><Feed items={visible} loading={loading} onAll={()=>setFilter('all')}/><section className="public-note"><CircleHelp/><div><b>Plataforma ciudadana, no oficial</b><p>La información debe contrastarse con autoridades. <button className="text-link" onClick={()=>setView('emergency-lines')}>Consulta las líneas de tu región</button>.</p></div></section></>}<footer><div className="brand-mark">CR</div><p>Colombia Responde<br/><small>Tecnología abierta para ayudarnos.</small></p><span><Users size={15}/> Hecho en comunidad</span></footer></div>}
