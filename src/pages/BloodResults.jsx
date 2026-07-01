import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'
import { useRequireCity } from '../lib/useRequireCity'

const SORTS = {
  units: { label: 'Most units', fn: (a, b) => (b.quantity ?? 0) - (a.quantity ?? 0) },
  bank: { label: 'Bank A–Z', fn: (a, b) => (a.bankname || '').localeCompare(b.bankname || '') },
  type: { label: 'Blood type', fn: (a, b) => (a.name || '').localeCompare(b.name || '') },
}

export default function BloodResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const { availabilities = [], city, blood } = location.state ?? {}
  const [sort, setSort] = useState('units')
  const [nearby, setNearby] = useState([])
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [switching, setSwitching] = useState(null)
  useRequireCity(city)

  const sorted = useMemo(
    () => [...availabilities].sort(SORTS[sort].fn),
    [availabilities, sort]
  )

  useEffect(() => {
    if (availabilities.length > 0 || !blood) { setNearby([]); return }
    setNearbyLoading(true)
    axios
      .get(`/api/blood/nearby?blood=${blood}&exclude=${encodeURIComponent(city)}`)
      .then(({ data }) => setNearby(data))
      .catch(() => setNearby([]))
      .finally(() => setNearbyLoading(false))
  }, [availabilities.length, blood, city])

  const searchNearbyCity = async (targetCity) => {
    setSwitching(targetCity)
    try {
      const { data } = await axios.get(`/api/blood?city=${targetCity}&blood=${blood}`)
      navigate('/guest/blood', { state: { availabilities: data, city: targetCity, blood }, replace: true })
    } finally {
      setSwitching(null)
    }
  }

  if (!city) return null

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
          <div>
            <EmptyState
              message="No blood banks found"
              sub={`No ${blood ? blood + ' blood' : 'results'} available in ${city} right now.`}
            />
            <div className="text-center -mt-4 px-4">
              <p className="text-zinc-600 text-sm mb-3">Someone in the community might help</p>
              <Link
                to="/guest/requests"
                state={{ city, blood }}
                className="inline-block bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                View Blood Requests in {city} →
              </Link>
            </div>

            {nearbyLoading && (
              <div className="flex justify-center mt-6">
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
              </div>
            )}

            {!nearbyLoading && nearby.length > 0 && (
              <div className="mt-6 px-1">
                <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wide mb-3 text-center">
                  {blood} available in nearby cities
                </p>
                <div className="space-y-2">
                  {nearby.map((n) => (
                    <button
                      key={n.city}
                      onClick={() => searchNearbyCity(n.city)}
                      disabled={switching !== null}
                      className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 rounded-2xl px-4 py-3.5 transition-colors disabled:opacity-60"
                    >
                      <span className="font-semibold text-white text-sm">{n.city}</span>
                      <span className="flex items-center gap-2 text-zinc-500 text-xs">
                        {switching === n.city ? (
                          <div className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                        ) : (
                          <>
                            {n.units} units
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                            </svg>
                          </>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
              <span className="text-zinc-600 text-xs font-semibold flex-shrink-0">Sort</span>
              {Object.entries(SORTS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    sort === key
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {sorted.map((a, i) => (
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
