import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import SOSButton from '../components/SOSButton'

export default function BloodResults() {
  const { availabilities = [], city, blood } = useLocation().state ?? {}

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Navbar back="/guest/info" />
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Blood Availability</h1>
        <p className="text-gray-500 text-sm mb-6">
          📍 {city} {blood && <span className="text-red-600">• 🩸 {blood}</span>}
        </p>

        {availabilities.length === 0 ? (
          <EmptyState icon="🩸" message="No blood banks found for your search." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {a.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {a.quantity} <span className="text-xs">units</span>
                  </span>
                </div>
                <p className="font-semibold text-gray-800">{a.bankname}</p>
                <p className="text-gray-400 text-sm mt-0.5">📍 {a.city}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  )
}
