import { useNavigate } from 'react-router-dom'

function BloodDrop() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="w-24 h-24 mx-auto mb-4 drop-shadow-lg animate-pulse-slow"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5 C50 5 10 55 10 78 C10 101 28 115 50 115 C72 115 90 101 90 78 C90 55 50 5 50 5Z"
        fill="#dc2626"
      />
      <path
        d="M35 75 C35 65 42 58 50 55"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <BloodDrop />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">
          Pranaraksha<span className="text-red-600">Seva</span>
        </h1>
        <p className="text-gray-500 text-sm mb-2">प्राणरक्षासेवा</p>
        <p className="text-gray-400 text-sm mb-8">
          Emergency healthcare at your fingertips
        </p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-3">
          <button
            onClick={() => navigate('/guest')}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-base"
          >
            🩺 Find Help (Guest)
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-base"
          >
            🏥 Admin Login
          </button>
          <button
            onClick={() => navigate('/donor/register')}
            className="w-full border border-red-200 hover:bg-red-50 active:scale-95 text-red-600 font-semibold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-base"
          >
            ❤️ Register as Donor
          </button>
        </div>

        <p className="text-xs text-gray-300 mt-6">
          Saving lives, one connection at a time
        </p>
      </div>
    </div>
  )
}
