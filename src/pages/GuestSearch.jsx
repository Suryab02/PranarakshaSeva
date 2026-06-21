import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Navbar back="/" />
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Find Help Nearby</h1>
            <p className="text-gray-500 text-sm mt-1">
              Select your city to find blood banks, doctors, and ambulances
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                📍 City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-800"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                🩸 Blood Group <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <select
                value={blood}
                onChange={(e) => setBlood(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-800"
              >
                <option value="">All Blood Types</option>
                {BLOOD_TYPES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all duration-150 mt-2"
            >
              Find Services →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
