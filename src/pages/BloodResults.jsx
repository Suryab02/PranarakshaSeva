import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'

export default function BloodResults() {
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
            <h1 className="text-3xl font-black text-white">Blood Banks</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-zinc-400 text-sm">{city}</span>
              {blood && (
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{blood}</span>
              )}
            </div>
          </div>
          {availabilities.length > 0 && (
            <span className="text-zinc-500 text-sm font-medium mb-0.5">{availabilities.length} found</span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        {availabilities.length === 0 ? (
          <EmptyState
            message="No blood banks found"
            sub={`No ${blood ? blood + ' blood' : 'results'} available in ${city} right now.`}
          />
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{a.name}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{a.bankname}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{a.city}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-white text-xl">{a.quantity}</p>
                  <p className="text-zinc-500 text-xs">units</p>
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
