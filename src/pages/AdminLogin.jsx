import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      navigate('/admin/dashboard', { state: { bankname: data.bankname } })
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-12 self-start transition-colors flex items-center gap-1.5"
      >
        ← Back
      </button>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-4xl font-black text-white mb-1">Admin<br />Portal</h1>
        <p className="text-zinc-500 text-sm mb-10">Sign in to manage your blood bank inventory.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Enter username"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px]"
            />
          </div>
          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter password"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px]"
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
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-[14px] rounded-2xl transition-all text-[15px] mt-2"
            style={{ boxShadow: loading ? 'none' : '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  )
}
