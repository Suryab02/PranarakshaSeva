import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const inputCls = 'w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px]'
const labelCls = 'block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const password = e.target.password.value
    const confirm = e.target.confirm.value
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/auth/register', {
        username: e.target.username.value,
        password,
        bankname: e.target.bankname.value,
      })
      setSuccess(true)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(detail || 'Registration failed. Try a different username.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xs">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Account Created</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Your blood bank admin account is ready. Sign in to manage your inventory.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            Sign In →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/admin')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-8 self-start transition-colors flex items-center gap-1.5"
      >
        ← Back to Sign In
      </button>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-1">Register<br />Blood Bank</h1>
        <p className="text-zinc-500 text-sm mb-10">Create an admin account to manage your blood bank inventory.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Blood Bank Name</label>
            <input name="bankname" type="text" required placeholder="e.g. Apollo Hospital Blood Bank" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Username</label>
            <input name="username" type="text" required autoComplete="username" placeholder="Choose a username" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <input name="password" type="password" required autoComplete="new-password" placeholder="Create a password" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Confirm Password</label>
            <input name="confirm" type="password" required autoComplete="new-password" placeholder="Repeat password" className={inputCls} />
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-600/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-[14px] rounded-2xl transition-all text-[15px] mt-2"
            style={{ boxShadow: loading ? 'none' : '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  )
}
