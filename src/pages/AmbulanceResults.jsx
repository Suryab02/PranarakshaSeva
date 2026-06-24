import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'

export default function AmbulanceResults() {
  const navigate = useNavigate()
  const { availabilities = [], city, blood } = useLocation().state ?? {}
  const [copied, setCopied] = useState(null)

  const copyNum = (num) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopied(num)
      setTimeout(() => setCopied(null), 1500)
    })
  }

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
            <h1 className="text-3xl font-black text-white">Ambulance</h1>
            <p className="text-zinc-400 text-sm mt-1">{city} · 24/7 Emergency</p>
          </div>
          {availabilities.length > 0 && (
            <span className="text-zinc-500 text-sm font-medium mb-0.5">{availabilities.length} found</span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        {availabilities.length === 0 ? (
          <EmptyState
            message="No ambulances listed"
            sub={`No ambulance services found in ${city}.`}
          />
        ) : (
          <div className="space-y-3">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V7c0-.55.45-1 1-1z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{a.hospital}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{a.city}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyNum(a.contact)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                    title="Copy number"
                  >
                    {copied === a.contact ? (
                      <span className="text-green-400 text-xs font-semibold">Copied!</span>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                  <a
                    href={`tel:${a.contact}`}
                    className="bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all font-mono"
                  >
                    {a.contact}
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
