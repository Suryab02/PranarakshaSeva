import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Goa', 'Vizag']
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function GuestSearch() {
  const navigate = useNavigate()
  const [city, setCity] = useState('Bengaluru')
  const [blood, setBlood] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/guest/info', { state: { city, blood } })
  }

  return (
    <div className="min-h-screen lg:min-h-full bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-12 self-start transition-colors flex items-center gap-1.5"
      >
        ← Back
      </button>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-5xl font-black text-white leading-[1.05] mb-3">
          Where do<br />you need<br /><span className="text-red-500">help?</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
          Find blood banks, doctors, and ambulances near you instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* City selector */}
          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              City
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    city === c
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Blood type pills */}
          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              Blood Group <span className="text-zinc-700 normal-case tracking-normal font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBlood(blood === b ? '' : b)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    blood === b
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            {blood && (
              <button
                type="button"
                onClick={() => setBlood('')}
                className="mt-2 text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
              >
                × Clear selection
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-[15px] rounded-2xl transition-all text-[15px] tracking-wide"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            {blood ? `Find ${blood} in ${city} →` : `Find Services in ${city} →`}
          </button>
        </form>
      </div>
    </div>
  )
}
