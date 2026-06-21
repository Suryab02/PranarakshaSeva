import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'

export default function DoctorResults() {
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
        <h1 className="text-3xl font-black text-white">Doctors</h1>
        <p className="text-zinc-400 text-sm mt-1">{city}</p>
      </div>

      <div className="flex-1 px-5 pt-4 pb-24">
        {availabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="#2563eb" className="w-7 h-7">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <p className="font-bold text-gray-800">No doctors found</p>
            <p className="text-gray-400 text-sm mt-1">No doctors registered in {city} yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{a.name}</p>
                      <p className="text-blue-600 text-sm font-medium mt-0.5">{a.qualification}</p>
                      <p className="text-gray-400 text-sm mt-1">{a.hospital}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${a.contact}`}
                    className="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex-shrink-0"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  )
}
