import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SOSButton from '../components/SOSButton'

const BloodIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2L5.5 12C5.5 15.59 8.41 18.5 12 18.5S18.5 15.59 18.5 12L12 2Z" />
  </svg>
)
const DoctorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)
const AmbulanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V7c0-.55.45-1 1-1z" />
  </svg>
)
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const SERVICES = [
  {
    id: 'blood',
    Icon: BloodIcon,
    iconBg: 'bg-red-600',
    title: 'Blood Banks',
    desc: 'Live availability across banks',
    path: 'blood',
    navPath: '/guest/blood',
  },
  {
    id: 'doctor',
    Icon: DoctorIcon,
    iconBg: 'bg-blue-600',
    title: 'Doctors',
    desc: 'Emergency specialists near you',
    path: 'doctor',
    navPath: '/guest/doctor',
  },
  {
    id: 'ambulance',
    Icon: AmbulanceIcon,
    iconBg: 'bg-orange-500',
    title: 'Ambulance',
    desc: '24/7 ambulance contacts',
    path: 'ambulance',
    navPath: '/guest/ambulance',
  },
]

export default function GuestServices() {
  const { city, blood } = useLocation().state ?? {}
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const fetchAndGo = async ({ id, path, navPath }) => {
    setLoading(id)
    try {
      let url = `/api/${path}?city=${city}`
      if (id === 'blood' && blood) url += `&blood=${blood}`
      const { data } = await axios.get(url)
      navigate(navPath, { state: { availabilities: data, city, blood } })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-5 pt-10 pb-6">
        <button
          onClick={() => navigate('/guest')}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-black text-white leading-tight">
          Services in<br />
          <span className="text-red-500">{city}</span>
        </h1>
        {blood && (
          <span className="inline-block mt-2 bg-red-600/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-600/30">
            {blood} blood group
          </span>
        )}
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        <div className="divide-y divide-zinc-800">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => fetchAndGo(s)}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 py-4 text-left hover:bg-zinc-800/60 active:bg-zinc-800 transition-colors disabled:opacity-60 rounded-2xl px-3 -mx-3"
            >
              <div className={`${s.iconBg} w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0`}>
                {loading === s.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <s.Icon />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-[15px]">{s.title}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{s.desc}</p>
              </div>
              <svg className="w-4 h-4 text-zinc-700 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/guest/map', { state: { city, blood } })}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-white rounded-2xl p-4 text-left transition-colors active:scale-[0.98]"
          >
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center mb-3">
              <MapIcon />
            </div>
            <p className="font-bold text-sm">Map View</p>
            <p className="text-zinc-500 text-xs mt-0.5">See all on map</p>
          </button>
          <button
            onClick={() => navigate('/donor/register')}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-white rounded-2xl p-4 text-left transition-colors active:scale-[0.98]"
          >
            <div className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center mb-3">
              <HeartIcon />
            </div>
            <p className="font-bold text-sm">Donate Blood</p>
            <p className="text-zinc-500 text-xs mt-0.5">Register as donor</p>
          </button>
        </div>
      </div>

      <SOSButton city={city} />
    </div>
  )
}
