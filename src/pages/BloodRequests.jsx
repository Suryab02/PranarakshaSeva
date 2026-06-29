import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SOSButton from '../components/SOSButton'
import EmptyState from '../components/EmptyState'
import { useToast } from '../toast'

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Goa', 'Vizag']
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const labelCls = 'block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3'
const inputCls = 'w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px]'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function RequestCard({ req }) {
  const [copied, setCopied] = useState(false)

  const copyNum = () => {
    navigator.clipboard.writeText(req.contact).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={`bg-zinc-800 border rounded-2xl p-4 ${req.urgency === 'critical' ? 'border-red-600/50' : 'border-zinc-700/50'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-red-600 text-white text-sm font-black px-2.5 py-0.5 rounded-lg">
            {req.blood_type}
          </span>
          {req.urgency === 'critical' && (
            <span className="bg-red-600/15 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-600/30 uppercase tracking-wider animate-pulse">
              Critical
            </span>
          )}
        </div>
        <span className="text-zinc-600 text-xs flex-shrink-0">{timeAgo(req.created_at)}</span>
      </div>

      <p className="font-bold text-white text-[15px]">{req.name}</p>
      <p className="text-zinc-500 text-sm mt-0.5">{req.city}</p>

      {req.message && (
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed italic">"{req.message}"</p>
      )}

      <div className="mt-3 pt-3 border-t border-zinc-700/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-white font-mono text-sm font-semibold">{req.contact}</p>
          <button onClick={copyNum} className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0">
            {copied
              ? <span className="text-green-400 text-xs font-semibold">Copied!</span>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            }
          </button>
        </div>
        <a
          href={`tel:${req.contact}`}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-colors flex-shrink-0"
        >
          Call
        </a>
      </div>
    </div>
  )
}

function PostForm({ defaultCity, defaultBlood, onSuccess }) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [blood, setBlood] = useState(defaultBlood || '')
  const [city, setCity] = useState(defaultCity || 'Bengaluru')
  const [urgency, setUrgency] = useState('normal')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!blood) { setError('Please select a blood type.'); return }
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/request', { name, contact, blood_type: blood, city, urgency, message })
      toast(`Request posted — ${blood} in ${city}`)
      onSuccess({ blood, city })
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '))
      } else {
        setError(detail || 'Failed to post. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label className={labelCls}>Your Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Phone Number</label>
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          type="tel"
          required
          pattern="[0-9]{10}"
          placeholder="10-digit mobile number"
          className={inputCls}
        />
        <p className="text-zinc-600 text-xs mt-1.5">This number will be visible to donors who respond.</p>
      </div>

      <div>
        <label className={labelCls}>Blood Type Needed</label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_TYPES.map(b => (
            <button key={b} type="button" onClick={() => setBlood(b)}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${blood === b ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>City</label>
        <div className="grid grid-cols-4 gap-2">
          {CITIES.map(c => (
            <button key={c} type="button" onClick={() => setCity(c)}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${city === c ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Urgency</label>
        <div className="grid grid-cols-2 gap-2">
          {['normal', 'critical'].map(u => (
            <button key={u} type="button" onClick={() => setUrgency(u)}
              className={`py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${urgency === u
                ? u === 'critical' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}>
              {u === 'critical' ? '🚨 Critical' : 'Normal'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Message <span className="text-zinc-700 normal-case tracking-normal font-normal">(optional, {150 - message.length} chars left)</span>
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, 150))}
          placeholder="e.g. Patient is post-surgery at Apollo Hospital"
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-[14px] rounded-2xl transition-all text-[15px]"
        style={{ boxShadow: loading ? 'none' : '0 8px 30px rgba(220,38,38,0.3)' }}
      >
        {loading ? 'Posting...' : `Post Request — ${blood || '?'} in ${city}`}
      </button>
    </form>
  )
}

export default function BloodRequests() {
  const navigate = useNavigate()
  const { city, blood } = useLocation().state ?? {}

  const [tab, setTab] = useState('view')
  const [requests, setRequests] = useState([])
  const [fetching, setFetching] = useState(false)
  const [posted, setPosted] = useState(null)

  const loadRequests = useCallback(async () => {
    if (!city) return
    setFetching(true)
    try {
      const params = new URLSearchParams({ city })
      if (blood) params.set('blood', blood)
      const { data } = await axios.get(`/api/request?${params}`)
      setRequests(data)
    } catch {
      setRequests([])
    } finally {
      setFetching(false)
    }
  }, [city, blood])

  useEffect(() => {
    if (tab === 'view') loadRequests()
  }, [tab, loadRequests])

  if (posted) {
    return (
      <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xs">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M12 2L5.5 12C5.5 15.59 8.41 18.5 12 18.5S18.5 15.59 18.5 12L12 2Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Request Posted</h2>
          <p className="text-zinc-400 text-sm mb-2 leading-relaxed">
            Your need for <span className="text-white font-semibold">{posted.blood}</span> blood in <span className="text-white font-semibold">{posted.city}</span> is now live.
          </p>
          <p className="text-zinc-600 text-xs mb-8">It will be visible for 72 hours.</p>
          <div className="space-y-3">
            <button
              onClick={() => { setPosted(null); setTab('view') }}
              className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all"
              style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.3)' }}
            >
              View Active Requests
            </button>
            <button onClick={() => navigate('/guest/info', { state: { city, blood } })} className="w-full text-zinc-500 hover:text-zinc-300 font-medium py-3 transition-colors text-sm">
              Back to Services
            </button>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-black text-white">Blood Requests</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-zinc-400 text-sm">{city || 'All cities'}</span>
              {blood && (
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{blood}</span>
              )}
            </div>
          </div>
          {tab === 'view' && requests.length > 0 && (
            <span className="text-zinc-500 text-sm font-medium mb-0.5">{requests.length} open</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5">
          {[['view', 'Active Requests'], ['post', 'Post a Request']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-24">
        {tab === 'view' ? (
          fetching ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div>
              <EmptyState
                message="No open requests"
                sub={`No one has posted a ${blood ? blood + ' blood' : 'blood'} request in ${city || 'this city'} yet.`}
              />
              <div className="text-center mt-2">
                <button
                  onClick={() => setTab('post')}
                  className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                >
                  Be the first — Post your request →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req, i) => (
                <RequestCard key={i} req={req} />
              ))}
              <p className="text-center text-zinc-700 text-xs pt-2">Requests expire automatically after 72 hours</p>
            </div>
          )
        ) : (
          <PostForm
            defaultCity={city}
            defaultBlood={blood}
            onSuccess={(info) => setPosted(info)}
          />
        )}
      </div>

      <SOSButton city={city} />
    </div>
  )
}
