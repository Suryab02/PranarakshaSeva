import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Goa', 'Vizag']
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const inputCls = "w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-[15px] appearance-none"
const labelCls = "block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2"

export default function DonorRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/donor', {
        name: e.target.name.value,
        blood_type: e.target.blood_type.value,
        city: e.target.city.value,
        contact: e.target.contact.value,
        available: true,
      })
      setSuccess(true)
    } catch {
      setError('Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-pink-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Thank You!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            You're now registered as a blood donor. Your contribution can save up to 3 lives.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-3.5 px-8 rounded-2xl transition-all"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-12 self-start transition-colors flex items-center gap-1.5"
      >
        ← Back
      </button>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-1">Donate<br />Blood</h1>
        <p className="text-zinc-500 text-sm mb-10">Your donation can save up to 3 lives.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input name="name" type="text" required placeholder="Your full name" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Blood Type</label>
              <select name="blood_type" required className={inputCls}>
                {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>City</label>
              <select name="city" required className={inputCls}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              name="contact"
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
              className={inputCls}
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
            {loading ? 'Registering...' : 'Register as Donor →'}
          </button>
        </form>
      </div>
    </div>
  )
}
