import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../toast'

const inputCls = 'w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px]'
const labelCls = 'block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2'

function formatExpiry(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function OperatorInvite() {
  const navigate = useNavigate()
  const toast = useToast()
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [bankname, setBankname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [invites, setInvites] = useState([])   // most-recent first

  const handleSubmit = async (e) => {
    e.preventDefault()
    const bank = bankname.trim()
    if (!secret.trim() || !bank) return
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post(
        '/api/auth/invite',
        { bankname: bank },
        { headers: { 'x-invite-secret': secret.trim() } },
      )
      setInvites((prev) => [{ ...data, id: Date.now() }, ...prev])
      setBankname('')
      toast('Invite created')
    } catch (err) {
      const status = err.response?.status
      if (status === 403) setError('Wrong operator secret. Check the ADMIN_INVITE_SECRET value.')
      else setError(err.response?.data?.detail || 'Could not create invite. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast('Invite code copied')
    } catch {
      toast('Copy failed — select and copy manually', 'error')
    }
  }

  return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-8 self-start transition-colors flex items-center gap-1.5"
      >
        ← Back
      </button>

      <div className="relative z-10 flex-1 max-w-sm mx-auto w-full">
        <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h3a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h3m6 0V5a3 3 0 00-6 0v2m6 0H9" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-1">Issue<br />Invite</h1>
        <p className="text-zinc-500 text-sm mb-10">
          Mint a one-time code that lets a blood bank set up its admin account. The code is bound to the bank you name here.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Operator Secret</label>
            <div className="relative">
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                type={showSecret ? 'text' : 'password'}
                required
                autoComplete="off"
                placeholder="ADMIN_INVITE_SECRET"
                className={`${inputCls} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowSecret((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs font-semibold uppercase tracking-wide"
              >
                {showSecret ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>Blood Bank Name</label>
            <input
              value={bankname}
              onChange={(e) => setBankname(e.target.value)}
              type="text"
              required
              placeholder="e.g. Apollo Hospital Blood Bank"
              className={inputCls}
            />
            <p className="text-zinc-600 text-xs mt-2">Use the bank's full, official name — it can't be changed later.</p>
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-600/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !secret.trim() || !bankname.trim()}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-[14px] rounded-2xl transition-all text-[15px] mt-2"
            style={{ boxShadow: loading ? 'none' : '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            {loading ? 'Creating…' : 'Create Invite →'}
          </button>
        </form>

        {invites.length > 0 && (
          <div className="mt-10">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">This session</p>
            <div className="space-y-3">
              {invites.map((inv) => (
                <div key={inv.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-white font-bold text-sm truncate">{inv.bankname}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">Expires {formatExpiry(inv.expires_at)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-red-400 font-mono text-sm tracking-wide truncate">
                      {inv.code}
                    </code>
                    <button
                      onClick={() => copy(inv.code)}
                      className="flex-shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-zinc-700 text-[11px] mt-2.5 leading-relaxed">
                    Share this code with the bank privately. It works once and won't be shown again.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
