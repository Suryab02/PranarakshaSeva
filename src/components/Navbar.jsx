import { useNavigate } from 'react-router-dom'

export default function Navbar({ back }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 mb-6">
      {back && (
        <button
          onClick={() => navigate(back)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      )}
    </div>
  )
}
