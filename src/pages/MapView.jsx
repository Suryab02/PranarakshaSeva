import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import SOSButton from '../components/SOSButton'

const CITY_COORDS = {
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.6139, 77.2090],
  Pune: [18.5204, 73.8567],
  Goa: [15.2993, 74.1240],
  Vizag: [17.6868, 83.2185],
}

const makeIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })

const redIcon = makeIcon('#dc2626')
const greenIcon = makeIcon('#16a34a')
const orangeIcon = makeIcon('#f97316')

const LEGEND = [
  { color: 'bg-red-600', label: 'Blood Banks' },
  { color: 'bg-green-600', label: 'Doctors' },
  { color: 'bg-orange-500', label: 'Ambulances' },
]

export default function MapView() {
  const { city = 'Bengaluru', blood } = useLocation().state ?? {}
  const navigate = useNavigate()
  const [data, setData] = useState({ blood: [], doctors: [], ambulances: [] })
  const [loading, setLoading] = useState(true)
  const center = CITY_COORDS[city] ?? [20.5937, 78.9629]

  useEffect(() => {
    Promise.all([
      axios.get(`/api/blood?city=${city}${blood ? `&blood=${blood}` : ''}`),
      axios.get(`/api/doctor?city=${city}`),
      axios.get(`/api/ambulance?city=${city}`),
    ]).then(([b, d, a]) => {
      setData({ blood: b.data, doctors: d.data, ambulances: a.data })
      setLoading(false)
    })
  }, [city])

  const jitter = (i) => ((i % 7) - 3) * 0.003

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-zinc-500 text-sm">Loading map...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Dark header */}
      <div className="bg-zinc-950 px-5 pt-10 pb-6">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-black text-white">Map View</h1>
        <p className="text-zinc-400 text-sm mt-1">{city} — all resources</p>

        {/* Legend */}
        <div className="flex gap-4 mt-4">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
              <span className="text-zinc-500 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map fills remaining height */}
      <div className="flex-1" style={{ minHeight: '480px' }}>
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.blood.map((b, i) => (
            <Marker key={i} position={[center[0] + jitter(i), center[1] + jitter(i)]} icon={redIcon}>
              <Popup>
                <strong>{b.name}</strong><br />{b.bankname}<br />{b.quantity} units
              </Popup>
            </Marker>
          ))}
          {data.doctors.map((d, i) => (
            <Marker key={i} position={[center[0] + jitter(i), center[1] + jitter(i)]} icon={greenIcon}>
              <Popup>
                <strong>{d.name}</strong><br />{d.qualification}<br />{d.hospital}<br />{d.contact}
              </Popup>
            </Marker>
          ))}
          {data.ambulances.map((a, i) => (
            <Marker key={i} position={[center[0] + jitter(i), center[1] + jitter(i)]} icon={orangeIcon}>
              <Popup>
                <strong>{a.hospital}</strong><br />{a.contact}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <SOSButton />
    </div>
  )
}
