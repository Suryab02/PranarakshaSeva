import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import SOSButton from '../components/SOSButton'

const CITY_COORDS = {
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Mumbai:    [19.0760, 72.8777],
  Delhi:     [28.6139, 77.2090],
  Pune:      [18.5204, 73.8567],
  Goa:       [15.2993, 74.1240],
  Vizag:     [17.6868, 83.2185],
}

// ── pin icons ────────────────────────────────────────────────────────────────
function makePinIcon(color, glyph = '') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <filter id="s" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.55)"/>
      </filter>
      <path filter="url(#s)" d="M16 2C9.37 2 4 7.37 4 14c0 9.5 12 24 12 24S28 23.5 28 14c0-6.63-5.37-12-12-12z" fill="${color}"/>
      <circle cx="16" cy="14" r="6" fill="rgba(255,255,255,0.25)"/>
      <text x="16" y="18" text-anchor="middle" font-size="9" font-family="system-ui,sans-serif" font-weight="800" fill="white">${glyph}</text>
    </svg>`
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  })
}

const ICONS = {
  blood:    makePinIcon('#dc2626', '🩸'),
  doctor:   makePinIcon('#2563eb', '＋'),
  hospital: makePinIcon('#ea580c', 'H'),
}

// ── Overpass ─────────────────────────────────────────────────────────────────
// overpass-api.de is the canonical instance but is heavily rate-limited and
// frequently times out; fall back to mirrors so "live" data doesn't silently die.
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
]

async function fetchOverpass(lat, lng, radiusM = 15000) {
  const amenities = ['hospital', 'clinic', 'doctors']
  const filters = amenities.flatMap((a) => [
    `node["amenity"="${a}"](around:${radiusM},${lat},${lng});`,
    `way["amenity"="${a}"](around:${radiusM},${lat},${lng});`,
  ]).join('')
  const query = `[out:json][timeout:20];(${filters});out center;`
  const qs = `?data=${encodeURIComponent(query)}`

  let lastErr
  for (const base of OVERPASS_MIRRORS) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 12000)
      const res = await fetch(base + qs, { signal: controller.signal })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`Overpass ${res.status}`)
      const json = await res.json()
      return json.elements
        .map((e) => ({
          id:   e.id,
          type: e.tags?.amenity,
          lat:  e.lat ?? e.center?.lat,
          lon:  e.lon ?? e.center?.lon,
          name: e.tags?.name ?? null,
          phone: e.tags?.['contact:phone'] || e.tags?.phone || null,
          addr: e.tags?.['addr:full'] || e.tags?.['addr:street'] || null,
        }))
        .filter((e) => e.lat && e.lon)
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr
}

// ── close sheet when map is tapped ───────────────────────────────────────────
function MapClickHandler({ onClose }) {
  useMapEvents({ click: onClose })
  return null
}

const jitter = (i) => ((i % 7) - 3) * 0.003

// ── bottom sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ item, onClose }) {
  if (!item) return null

  const isBlood = item.kind === 'blood'
  const isHospital = item.type === 'hospital'
  const accent = isBlood ? 'bg-red-600' : isHospital ? 'bg-orange-500' : 'bg-blue-600'

  return (
    <div
      className="absolute bottom-0 inset-x-0 z-[500] animate-sheet"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
        {/* drag handle */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />

        <div className="flex items-start gap-3">
          <div className={`${accent} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xs`}>
            {isBlood ? item.name : isHospital ? 'H' : '+'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-[15px] leading-tight">{item.bankname ?? item.displayName ?? 'Unnamed'}</p>
            {isBlood
              ? <p className="text-zinc-500 text-sm mt-0.5">{item.quantity} units available · {item.city}</p>
              : <p className="text-zinc-500 text-sm mt-0.5 capitalize">{item.type}{item.addr ? ` · ${item.addr}` : ''}</p>
            }
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-sm transition-colors flex-shrink-0"
          >
            ×
          </button>
        </div>

        {item.phone && (
          <div className="mt-4 flex gap-2">
            <a
              href={`tel:${item.phone}`}
              className="flex-1 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-bold py-3 rounded-2xl text-sm text-center transition-all"
            >
              Call {item.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ── filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ active, color, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
        active
          ? `${color} text-white border-transparent shadow-md`
          : 'bg-zinc-900/80 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? 'bg-white/50' : color.replace('bg-', 'bg-')}`} />
      {label} {count > 0 && <span className={active ? 'text-white/70' : 'text-zinc-600'}>({count})</span>}
    </button>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function MapView() {
  const { city = 'Bengaluru', blood } = useLocation().state ?? {}
  const navigate = useNavigate()
  const center = CITY_COORDS[city] ?? [20.5937, 78.9629]

  const [bloodBanks,   setBloodBanks]   = useState([])
  const [osmPoints,    setOsmPoints]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [osmOk,        setOsmOk]        = useState(null)
  const [osmRetrying,  setOsmRetrying]  = useState(false)
  const [retryToken,   setRetryToken]   = useState(0)
  const [selected,     setSelected]     = useState(null)
  const [filters,      setFilters]      = useState({ blood: true, doctor: true, hospital: true })

  useEffect(() => {
    axios
      .get(`/api/blood?city=${city}${blood ? `&blood=${blood}` : ''}`)
      .then(({ data }) => setBloodBanks(data))
      .catch(() => {})
  }, [city])

  useEffect(() => {
    setOsmRetrying(retryToken > 0)
    fetchOverpass(center[0], center[1])
      .then((pts) => { setOsmPoints(pts); setOsmOk(true) })
      .catch(() => setOsmOk(false))
      .finally(() => { setLoading(false); setOsmRetrying(false) })
  }, [city, retryToken])

  const closeSheet = useCallback(() => setSelected(null), [])
  const toggleFilter = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }))

  const doctors   = osmPoints.filter((p) => ['clinic', 'doctors'].includes(p.type))
  const hospitals = osmPoints.filter((p) => p.type === 'hospital')

  if (loading) return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm">Loading map…</p>
    </div>
  )

  return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col relative">
      {/* header */}
      <div className="px-5 pt-10 pb-4 bg-zinc-950 relative z-10">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-5 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white leading-tight">Map View</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{city}{blood ? ` · ${blood}` : ''}</p>
          </div>
          {osmOk === false && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-[11px] font-semibold">Live data unavailable</span>
              <button
                onClick={() => setRetryToken((t) => t + 1)}
                disabled={osmRetrying}
                className="text-yellow-500 hover:text-yellow-400 text-[11px] font-bold underline underline-offset-2 disabled:opacity-50"
              >
                {osmRetrying ? 'Retrying…' : 'Retry'}
              </button>
            </div>
          )}
        </div>

        {/* filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <FilterPill
            active={filters.blood}
            color="bg-red-600"
            label="Blood Banks"
            count={bloodBanks.length}
            onClick={() => toggleFilter('blood')}
          />
          <FilterPill
            active={filters.doctor}
            color="bg-blue-600"
            label="Clinics"
            count={doctors.length}
            onClick={() => toggleFilter('doctor')}
          />
          <FilterPill
            active={filters.hospital}
            color="bg-orange-500"
            label="Hospitals"
            count={hospitals.length}
            onClick={() => toggleFilter('hospital')}
          />
        </div>
      </div>

      {/* map */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%', minHeight: '360px' }}
          zoomControl={false}
        >
          {/* CartoDB Dark Matter — free, no API key, matches dark UI perfectly */}
          <TileLayer
            attribution='© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          <MapClickHandler onClose={closeSheet} />

          {/* blood bank pins — jittered around city center (no real coords stored) */}
          {filters.blood && bloodBanks.map((b, i) => (
            <Marker
              key={`b-${i}`}
              position={[center[0] + jitter(i), center[1] + jitter(i + 3)]}
              icon={ICONS.blood}
              eventHandlers={{ click: () => setSelected({ ...b, kind: 'blood', displayName: b.bankname }) }}
            />
          ))}

          {/* doctor/clinic pins */}
          {filters.doctor && doctors.map((d) => (
            <Marker
              key={`d-${d.id}`}
              position={[d.lat, d.lon]}
              icon={ICONS.doctor}
              eventHandlers={{ click: () => setSelected({ ...d, kind: 'osm', displayName: d.name ?? 'Clinic' }) }}
            />
          ))}

          {/* hospital pins */}
          {filters.hospital && hospitals.map((h) => (
            <Marker
              key={`h-${h.id}`}
              position={[h.lat, h.lon]}
              icon={ICONS.hospital}
              eventHandlers={{ click: () => setSelected({ ...h, kind: 'osm', displayName: h.name ?? 'Hospital' }) }}
            />
          ))}
        </MapContainer>

        {/* bottom sheet slides up over the map */}
        {selected && <BottomSheet item={selected} onClose={closeSheet} />}
      </div>

      <SOSButton city={city} />
    </div>
  )
}
