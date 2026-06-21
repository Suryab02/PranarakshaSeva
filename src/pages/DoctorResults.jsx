import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import SOSButton from '../components/SOSButton'

export default function DoctorResults() {
  const { availabilities = [], city } = useLocation().state ?? {}

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Navbar back="/guest/info" />
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Doctors</h1>
        <p className="text-gray-500 text-sm mb-6">📍 {city}</p>

        {availabilities.length === 0 ? (
          <EmptyState icon="👨‍⚕️" message="No doctors found in your city." />
        ) : (
          <div className="space-y-4">
            {availabilities.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">{a.name}</h2>
                    <p className="text-red-600 text-sm font-medium">{a.qualification}</p>
                  </div>
                  <a
                    href={`tel:${a.contact}`}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    📞 Call
                  </a>
                </div>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>🏥 {a.hospital}</p>
                  <p>📍 {a.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  )
}
