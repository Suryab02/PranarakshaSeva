import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import Navbar from '../components/Navbar'
import SOSButton from '../components/SOSButton'
import LoadingSpinner from '../components/LoadingSpinner'

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
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

const redIcon = makeIcon('#dc2626')
const greenIcon = makeIcon('#16a34a')
const orangeIcon = makeIcon('#ea580c')

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

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LoadingSpinner text="Loading map data..." />
    </div>
  )

  const jitter = (i) => (Math.random() - 0.5) * 0.02

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Navbar back="/guest/info" />
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Map View</h1>
        <p className="text-gray-500 text-sm mb-4">📍 {city} — all resources on the map</p>

        <div className="flex gap-4 mb-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> Blood Banks</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-600 inline-block" /> Doctors</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Ambulances</span>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[480px]">
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
                  <strong>{a.hospital}</strong><br />📞 {a.contact}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <SOSButton />
    </div>
  )
}
