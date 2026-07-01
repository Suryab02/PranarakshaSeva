import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'
import { useRequireCity } from '../lib/useRequireCity'

export default function DonorResults() {
  const navigate = useNavigate()
  const { availabilities = [], city, blood } = useLocation().state ?? {}
  const [copied, setCopied] = useState(null)
  useRequireCity(city)
  if (!city) return null

  const copyNum = (num) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopied(num)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col">
      <div className="px-5 pt-10 pb-6">
        <button
          onClick={() => navigate('/guest/info', { state: { city, blood } })}
          className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Blood Donors</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-zinc-400 text-sm">{city}</span>
              {blood && (
                <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{blood}</span>
              )}
            </div>
          </div>
          {availabilities.length > 0 && (
            <span className="text-zinc-500 text-sm font-medium mb-0.5">{availabilities.length} available</span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        {availabilities.length === 0 ? (
          <div>
            <EmptyState
              message="No donors available"
              sub={`No ${blood ? blood + ' ' : ''}donors are registered in ${city} right now.`}
            />
            <div className="text-center -mt-4">
              <Link
                to="/donor/register"
                className="inline-block bg-rose-600/10 hover:bg-rose-600/20 border border-rose-600/30 text-rose-400 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Become a donor →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.map((d, i) => (
              <div key={i} className="bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-rose-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{d.blood_type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{d.name}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{d.city}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyNum(d.contact)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                    title="Copy number"
                  >
                    {copied === d.contact ? (
                      <span className="text-green-400 text-xs font-semibold">Copied!</span>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                  <a
                    href={`tel:${d.contact}`}
                    className="bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
            <p className="text-center text-zinc-700 text-xs pt-2">
              Please call respectfully — donors are volunteers.
            </p>
          </div>
        )}
      </div>
      <SOSButton city={city} />
    </div>
  )
}
