import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'

export default function AmbulanceResults() {
  const navigate = useNavigate()
  const { availabilities = [], city, blood } = useLocation().state ?? {}

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-zinc-950 px-5 pt-10 pb-8">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-black text-white">Ambulance</h1>
        <p className="text-zinc-400 text-sm mt-1">{city} · 24/7 Emergency</p>
      </div>

      <div className="flex-1 px-5 pt-4 pb-24">
        {availabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="#f97316" className="w-7 h-7">
                <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V7c0-.55.45-1 1-1z" />
              </svg>
            </div>
            <p className="font-bold text-gray-800">No ambulances listed</p>
            <p className="text-gray-400 text-sm mt-1">No ambulance services found in {city}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V7c0-.55.45-1 1-1z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{a.hospital}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{a.city}</p>
                </div>
                <a
                  href={`tel:${a.contact}`}
                  className="bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex-shrink-0"
                >
                  {a.contact}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  )
}
