import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import SOSButton from '../components/SOSButton'

export default function AmbulanceResults() {
  const { availabilities = [], city } = useLocation().state ?? {}

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Navbar back="/guest/info" />
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Ambulance Numbers</h1>
        <p className="text-gray-500 text-sm mb-6">📍 {city}</p>

        {availabilities.length === 0 ? (
          <EmptyState icon="🚑" message="No ambulance services found in your city." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-1">{a.hospital}</h3>
                <p className="text-gray-400 text-sm mb-4">📍 {a.city}</p>
                <a
                  href={`tel:${a.contact}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  📞 {a.contact}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  )
}
