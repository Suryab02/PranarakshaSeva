import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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

const makeIcon = (color, size = 12) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })

const redIcon    = makeIcon('#dc2626', 14)
const greenIcon  = makeIcon('#16a34a', 11)
const orangeIcon = makeIcon('#f97316', 11)

// GET request avoids CORS preflight that Overpass rejects on POST
async function fetchOverpass(lat, lng, amenities, radiusM = 15000) {
  const filters = amenities.flatMap((a) => [
    `node["amenity"="${a}"](around:${radiusM},${lat},${lng});`,
    `way["amenity"="${a}"](around:${radiusM},${lat},${lng});`,
  ]).join('')

  const query = `[out:json][timeout:20];(${filters});out center;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Overpass ${res.status}`)

  const json = await res.json()
  return json.elements
    .map((e) => ({
      id:   e.id,
      lat:  e.lat  ?? e.center?.lat,
      lon:  e.lon  ?? e.center?.lon,
      tags: e.tags ?? {},
    }))
    .filter((e) => e.lat && e.lon)
}

const phone = (tags) =>
  tags['contact:phone'] || tags.phone || tags['phone:mobile'] || null

const jitter = (i) => ((i % 7) - 3) * 0.003

export default function MapView() {
  const { city = 'Bengaluru', blood } = useLocation().state ?? {}
  const navigate  = useNavigate()
  const center    = CITY_COORDS[city] ?? [20.5937, 78.9629]

  const [bloodBanks,   setBloodBanks]   = useState([])
  const [osmDoctors,   setOsmDoctors]   = useState([])
  const [osmHospitals, setOsmHospitals] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [osmOk,        setOsmOk]        = useState(null) // null | true | false

  useEffect(() => {
    const dbFetch = axios
      .get(`/api/blood?city=${city}${blood ? `&blood=${blood}` : ''}`)
      .then(({ data }) => setBloodBanks(data))
      .catch(() => {})

    const osmFetch = fetchOverpass(center[0], center[1], ['hospital', 'clinic', 'doctors'])
      .then((elements) => {
        setOsmHospitals(elements.filter((e) => e.tags.amenity === 'hospital'))
        setOsmDoctors(elements.filter((e) => ['clinic', 'doctors'].includes(e.tags.amenity)))
        setOsmOk(true)
      })
      .catch(() => setOsmOk(false))

    Promise.allSettled([dbFetch, osmFetch]).then(() => setLoading(false))
  }, [city])

  if (loading) return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm">Fetching live map data…</p>
    </div>
  )

  return (
    <div className="min-h-screen lg:min-h-full bg-white flex flex-col">
      <div className="bg-zinc-950 px-5 pt-10 pb-6">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-black text-white">Map View</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{city}</p>

        {/* Legend with live counts */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0" />
            <span className="text-zinc-500 text-xs">Blood Banks ({bloodBanks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0" />
            <span className="text-zinc-500 text-xs">Clinics / Doctors ({osmDoctors.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-zinc-500 text-xs">Hospitals ({osmHospitals.length})</span>
          </div>
        </div>

        {/* OSM source tag */}
        <p className={`text-[11px] mt-3 ${osmOk ? 'text-zinc-600' : 'text-yellow-600'}`}>
          {osmOk === true  && '📍 Clinics & hospitals from OpenStreetMap — real locations'}
          {osmOk === false && '⚠ Live OSM data unavailable · blood banks still shown'}
        </p>
      </div>

      <div className="flex-1" style={{ minHeight: '480px' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Blood banks from our DB — jittered (no coords stored yet) */}
          {bloodBanks.map((b, i) => (
            <Marker key={`b-${i}`} position={[center[0] + jitter(i), center[1] + jitter(i + 3)]} icon={redIcon}>
              <Popup>
                <strong>{b.bankname}</strong><br />
                Blood type: <strong>{b.name}</strong><br />
                {b.quantity} units available
              </Popup>
            </Marker>
          ))}

          {/* Clinics & doctors from OSM — real coordinates */}
          {osmDoctors.map((d) => (
            <Marker key={`d-${d.id}`} position={[d.lat, d.lon]} icon={greenIcon}>
              <Popup>
                <strong>{d.tags.name ?? 'Clinic'}</strong><br />
                {d.tags.amenity}<br />
                {phone(d.tags) && <>📞 {phone(d.tags)}<br /></>}
                {d.tags['addr:full'] ?? d.tags['addr:street'] ?? ''}
              </Popup>
            </Marker>
          ))}

          {/* Hospitals from OSM — real coordinates */}
          {osmHospitals.map((h) => (
            <Marker key={`h-${h.id}`} position={[h.lat, h.lon]} icon={orangeIcon}>
              <Popup>
                <strong>{h.tags.name ?? 'Hospital'}</strong><br />
                {phone(h.tags) && <>📞 {phone(h.tags)}<br /></>}
                {h.tags['addr:full'] ?? h.tags['addr:street'] ?? ''}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <SOSButton />
    </div>
  )
}
