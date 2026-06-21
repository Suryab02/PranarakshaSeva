import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import SOSButton from '../components/SOSButton'
import LoadingSpinner from '../components/LoadingSpinner'

function ServiceCard({ icon, title, desc, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-left hover:shadow-lg hover:border-red-100 active:scale-95 transition-all duration-150 disabled:opacity-60 w-full"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-800 text-base mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-3">{desc}</p>
      <span className="text-red-600 text-sm font-medium">
        {loading ? 'Loading...' : 'Check availability →'}
      </span>
    </button>
  )
}

export default function GuestServices() {
  const { city, blood } = useLocation().state
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const fetch = async (type, path, navPath) => {
    setLoading(type)
    try {
      let url = `/api/${path}?city=${city}`
      if (type === 'blood' && blood) url += `&blood=${blood}`
      const { data } = await axios.get(url)
      navigate(navPath, { state: { availabilities: data, city, blood } })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Navbar back="/guest" />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Available Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            📍 {city} {blood && <span className="text-red-600">• 🩸 {blood}</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ServiceCard
            icon="🩸"
            title="Blood Banks"
            desc="Find blood availability across banks in your city"
            onClick={() => fetch('blood', 'blood', '/guest/blood')}
            loading={loading === 'blood'}
          />
          <ServiceCard
            icon="👨‍⚕️"
            title="Doctors"
            desc="Locate emergency doctors and specialists nearby"
            onClick={() => fetch('doctor', 'doctor', '/guest/doctor')}
            loading={loading === 'doctor'}
          />
          <ServiceCard
            icon="🚑"
            title="Ambulance"
            desc="Get 24/7 ambulance contacts for your city"
            onClick={() => fetch('ambulance', 'ambulance', '/guest/ambulance')}
            loading={loading === 'ambulance'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/guest/map', { state: { city, blood } })}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-left hover:shadow-lg hover:border-blue-100 transition-all"
          >
            <span className="text-3xl block mb-2">🗺️</span>
            <h3 className="font-bold text-gray-800 mb-1">View on Map</h3>
            <p className="text-gray-500 text-sm">See all resources pinned on an interactive map</p>
          </button>
          <button
            onClick={() => navigate('/donor/register')}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-left hover:shadow-lg hover:border-red-100 transition-all"
          >
            <span className="text-3xl block mb-2">❤️</span>
            <h3 className="font-bold text-gray-800 mb-1">Donate Blood</h3>
            <p className="text-gray-500 text-sm">Register as a donor and help save lives</p>
          </button>
        </div>
      </div>
      <SOSButton />
    </div>
  )
}
