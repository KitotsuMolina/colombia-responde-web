import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, CircleHelp, Clock3, HeartHandshake, House, MapPin, Menu, Navigation, PackageOpen, Search, ShieldCheck, Siren, UserRoundSearch, Users, Wifi, X } from 'lucide-react'
import { incidents, people } from './data'
import type { Incident, ReportKind } from './types'

type View = 'home' | 'report' | 'people'

const kindMeta: Record<ReportKind, { label: string; icon: typeof Siren; tone: string }> = {
  help: { label: 'Ayuda urgente', icon: Siren, tone: 'red' },
  damage: { label: 'Daño estructural', icon: House, tone: 'orange' },
  landslide: { label: 'Deslizamiento', icon: AlertTriangle, tone: 'orange' },
  road: { label: 'Vía bloqueada', icon: Navigation, tone: 'yellow' },
  water: { label: 'Agua disponible', icon: PackageOpen, tone: 'green' },
  medical: { label: 'Punto médico', icon: HeartHandshake, tone: 'green' },
  shelter: { label: 'Albergue', icon: House, tone: 'green' },
}

function Header({ onHome }: { onHome: () => void }) {
  return <header className="topbar">
    <button className="brand" onClick={onHome} aria-label="Ir al inicio">
      <span className="brand-mark">CR</span><span>Colombia<br/><b>Responde</b></span>
    </button>
    <div className="network"><Wifi size={15}/> Con conexión</div>
    <button className="icon-button" aria-label="Abrir menú"><Menu/></button>
  </header>
}

function Hero({ setView }: { setView: (v: View) => void }) {
  return <section className="hero">
    <div className="eyebrow"><span className="pulse"/> RED CIUDADANA DE EMERGENCIA</div>
    <h1>Ayuda que encuentra<br/><em>a quien la necesita.</em></h1>
    <p>Reporta emergencias, encuentra personas y consulta recursos disponibles en todo Colombia.</p>
    <div className="hero-actions">
      <button className="primary danger" onClick={() => setView('report')}><Siren/> Necesito ayuda</button>
      <button className="primary safe"><CheckCircle2/> Estoy bien</button>
    </div>
    <button className="location"><MapPin size={17}/> Usar mi ubicación <span>›</span></button>
  </section>
}

function MapPanel({ items }: { items: Incident[] }) {
  return <section className="map-card">
    <div className="map-head">
      <div><span className="section-kicker">SITUACIÓN ACTUAL</span><h2>Mapa ciudadano</h2></div>
      <button className="region"><MapPin size={15}/> Colombia <ChevronDown size={14}/></button>
    </div>
    <div className="map-canvas" aria-label="Mapa esquemático de reportes en Colombia">
      <svg className="colombia-shape" viewBox="0 0 300 390" aria-hidden="true"><path d="M105 15l37 17 31-10 23 35 34 13-9 43 28 26-15 35 15 32-29 23-11 45-30 18-14 68-28 18-17-47-30-31-2-46-33-14 18-42-21-37 23-30-14-32 35-24 13-40z"/></svg>
      <div className="map-grid"/>
      {items.map(item => { const meta = kindMeta[item.kind]; const Icon = meta.icon; return <button key={item.id} className={`marker ${meta.tone}`} style={{left:`${item.x}%`, top:`${item.y}%`}} title={`${item.title}, ${item.place}`}><Icon size={17}/><span className="marker-pop">{item.title}<small>{item.place}</small></span></button> })}
      <div className="map-note">Datos de demostración</div>
      <button className="locate"><Navigation size={18}/></button>
    </div>
    <div className="legend"><span><i className="dot red"/> Urgente</span><span><i className="dot orange"/> Daño</span><span><i className="dot green"/> Recurso</span></div>
  </section>
}

function Feed({ items }: { items: Incident[] }) {
  return <section className="feed">
    <div className="section-row"><div><span className="section-kicker">EN LA COMUNIDAD</span><h2>Reportes recientes</h2></div><button>Ver todos</button></div>
    <div className="report-list">{items.map(item => { const meta = kindMeta[item.kind]; const Icon = meta.icon; return <article className="report" key={item.id}>
      <div className={`report-icon ${meta.tone}`}><Icon/></div>
      <div className="report-body"><div className="report-title"><h3>{item.title}</h3><span>{item.id}</span></div><p><MapPin size={14}/>{item.place}</p><div className="report-meta"><span><Clock3 size={13}/>{item.time}</span><span className={`verification ${item.verification}`}><ShieldCheck size={13}/>{item.verification === 'verified' ? 'Verificado' : item.verification === 'community' ? 'Confirmación comunitaria' : 'Evidencia adjunta'}</span></div></div>
    </article>})}</div>
  </section>
}

function ReportForm({ close }: { close: () => void }) {
  const [kind, setKind] = useState<ReportKind>('help'); const [sent, setSent] = useState(false)
  if (sent) return <main className="form-page success-page"><CheckCircle2/><h1>Reporte guardado</h1><p>Quedó almacenado en este dispositivo y se enviará cuando haya conexión.</p><b>#COL-{Math.floor(Math.random()*90000+10000)}</b><button className="primary safe" onClick={close}>Volver al mapa</button></main>
  return <main className="form-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">NUEVO REPORTE</span><h1>¿Qué está ocurriendo?</h1><p>Si existe peligro inmediato, aléjate de la zona y contacta al 123.</p>
    <div className="kind-grid">{(Object.entries(kindMeta) as [ReportKind, typeof kindMeta[ReportKind]][]).map(([key, meta]) => { const Icon=meta.icon; return <button className={kind===key?'selected':''} onClick={()=>setKind(key)} key={key}><Icon/><span>{meta.label}</span></button>})}</div>
    <label>Ubicación del reporte<div className="input"><MapPin/><input placeholder="Departamento, municipio o dirección"/><button><Navigation/></button></div></label>
    <label>Cuéntanos lo esencial<textarea placeholder="¿Qué pasó? ¿Hay personas en riesgo? ¿Cómo se puede acceder?" rows={4}/></label>
    <div className="privacy"><ShieldCheck/><p><b>Publica con cuidado</b><br/>No incluyas teléfonos, documentos ni información médica en la descripción pública.</p></div>
    <button className="primary danger full" onClick={()=>setSent(true)}>Guardar reporte</button>
  </main>
}

function PeoplePage({ close }: { close: () => void }) {
  const [query,setQuery]=useState(''); const filtered=people.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())||p.place.toLowerCase().includes(query.toLowerCase()))
  return <main className="form-page people-page"><button className="back" onClick={close}><ArrowLeft/> Volver</button><span className="section-kicker">REUNIFICACIÓN FAMILIAR</span><h1>Buscar una persona</h1><p>Consulta por nombre o lugar. Los resultados son ciudadanos y requieren verificación.</p>
    <div className="searchbox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre, municipio o departamento"/>{query&&<button onClick={()=>setQuery('')}><X/></button>}</div>
    <button className="outline full"><UserRoundSearch/> Reportar persona desaparecida</button>
    <div className="people-list">{filtered.map(person=><article className="person" key={person.id}><div className="avatar">{person.initials}</div><div><h3>{person.name}, {person.age}</h3><p><MapPin size={13}/>{person.place}</p><small>{person.lastSeen}</small></div><span className={`person-status ${person.status}`}>{person.status==='missing'?'Desaparecida':person.status==='sighting'?'Avistamiento':'Localizada'}</span></article>)}</div>
  </main>
}

export default function App() {
  const [view,setView]=useState<View>('home'); const [filter,setFilter]=useState<'all'|'urgent'|'resources'>('all')
  const visible=useMemo(()=>incidents.filter(i=>filter==='all'||(filter==='urgent'?['help','damage','landslide'].includes(i.kind):['water','medical','shelter'].includes(i.kind))),[filter])
  return <div className="app"><Header onHome={()=>setView('home')}/>{view==='report'?<ReportForm close={()=>setView('home')}/>:view==='people'?<PeoplePage close={()=>setView('home')}/>:<><Hero setView={setView}/><nav className="quick-actions"><button onClick={()=>setView('people')}><UserRoundSearch/><span><b>Buscar persona</b><small>Desaparecidos y localizados</small></span></button><button onClick={()=>setView('report')}><House/><span><b>Reportar daño</b><small>Viviendas, vías y servicios</small></span></button></nav><div className="filterbar"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Todos</button><button className={filter==='urgent'?'active':''} onClick={()=>setFilter('urgent')}>Urgentes</button><button className={filter==='resources'?'active':''} onClick={()=>setFilter('resources')}>Ayuda disponible</button></div><MapPanel items={visible}/><Feed items={visible}/><section className="public-note"><CircleHelp/><div><b>Plataforma ciudadana, no oficial</b><p>La información debe contrastarse con autoridades. En una emergencia inmediata, llama al <strong>123</strong>.</p></div></section></>}<footer><div className="brand-mark">CR</div><p>Colombia Responde<br/><small>Tecnología abierta para ayudarnos.</small></p><span><Users size={15}/> Hecho en comunidad</span></footer></div>
}
