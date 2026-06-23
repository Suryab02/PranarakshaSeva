import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'

export default function DoctorResults() {
  const navigate = useNavigate()
  const { availabilities = [], city, blood } = useLocation().state ?? {}

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-5 pt-10 pb-6">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Doctors</h1>
            <p className="text-zinc-400 text-sm mt-1">{city}</p>
          </div>
          {availabilities.length > 0 && (
            <span className="text-zinc-500 text-sm font-medium mb-0.5">{availabilities.length} found</span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        {availabilities.length === 0 ? (
          <EmptyState
            message="No doctors found"
            sub={`No doctors registered in ${city} yet.`}
          />
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white">{a.name}</p>
                      <p className="text-blue-400 text-sm font-medium mt-0.5">{a.qualification}</p>
                      <p className="text-zinc-500 text-sm mt-1">{a.hospital}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${a.contact}`}
                    className="bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex-shrink-0"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton city={city} />
    </div>
  )
}
