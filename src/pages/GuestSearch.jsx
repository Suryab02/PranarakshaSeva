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
    <div className="min-h-screen bg-zinc-950 flex flex-col px-6 pt-10 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-300 text-sm font-medium mb-12 self-start transition-colors flex items-center gap-1.5"
      >
        <span>←</span> Back
      </button>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-5xl font-black text-white leading-[1.05] mb-3">
          Where do<br />you need<br /><span className="text-red-500">help?</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
          Find blood banks, doctors, and ambulances near you instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white focus:outline-none transition-colors text-[15px] appearance-none cursor-pointer"
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Blood Group <span className="text-zinc-700 normal-case tracking-normal font-normal">(optional)</span>
            </label>
            <select
              value={blood}
              onChange={(e) => setBlood(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white focus:outline-none transition-colors text-[15px] appearance-none cursor-pointer"
            >
              <option value="">All Blood Types</option>
              {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-[15px] rounded-2xl transition-all text-[15px] tracking-wide mt-2"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.3)' }}
          >
            Find Services →
          </button>
        </form>
      </div>
    </div>
  )
}
