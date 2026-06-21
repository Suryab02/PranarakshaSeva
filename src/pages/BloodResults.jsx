import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'

export default function BloodResults() {
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
        <h1 className="text-3xl font-black text-white">Blood Banks</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-zinc-400 text-sm">{city}</span>
          {blood && (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{blood}</span>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 pt-4 pb-24">
        {availabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="#dc2626" className="w-7 h-7">
                <path d="M12 2L5.5 12C5.5 15.59 8.41 18.5 12 18.5S18.5 15.59 18.5 12L12 2Z" />
              </svg>
            </div>
            <p className="font-bold text-gray-800">No results found</p>
            <p className="text-gray-400 text-sm mt-1">No blood banks match your search in {city}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{a.name}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{a.bankname}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{a.city}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 text-lg">{a.quantity}</p>
                  <p className="text-gray-400 text-xs">units</p>
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
