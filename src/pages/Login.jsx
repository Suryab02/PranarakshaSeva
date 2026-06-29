import { useNavigate } from 'react-router-dom'

function BloodDrop() {
  return (
    <svg viewBox="0 0 100 120" className="w-14 h-18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 5 C50 5 10 55 10 78 C10 101 28 115 50 115 C72 115 90 101 90 78 C90 55 50 5 50 5Z"
        fill="#dc2626"
      />
      <path d="M35 75 C35 65 42 58 50 55" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[320px]">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-5">
            <div className="absolute inset-0 scale-[2] bg-red-600/10 rounded-full blur-2xl" />
            <BloodDrop />
          </div>
          <h1 className="text-[2.1rem] font-black text-white tracking-tight leading-none text-center">
            Pranaraksha<span className="text-red-500">Seva</span>
          </h1>
          <p className="text-zinc-600 text-[11px] tracking-[0.25em] uppercase mt-2.5">
            प्राणरक्षासेवा
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/guest')}
            className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-[14px] rounded-2xl transition-all duration-150 text-[15px] tracking-wide"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.35)' }}
          >
            Find Help Now
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="w-full border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 active:scale-[0.98] text-zinc-300 hover:text-white font-semibold py-[14px] rounded-2xl transition-all duration-150 text-[15px]"
          >
            Admin Portal
          </button>
          <button
            onClick={() => navigate('/donor/register')}
            className="w-full text-zinc-600 hover:text-red-400 font-medium py-3 transition-colors text-sm"
          >
            + Register as Blood Donor
          </button>
        </div>

        <p className="text-zinc-800 text-[11px] text-center mt-12 leading-relaxed tracking-wide">
          BENGALURU · HYDERABAD · MUMBAI · DELHI · PUNE · GOA · VIZAG
        </p>
      </div>
    </div>
  )
}
