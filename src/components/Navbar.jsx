import { useNavigate } from 'react-router-dom'

export default function Navbar({ back, title }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 mb-6">
      {back && (
        <button
          onClick={() => navigate(back)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          ← Back
        </button>
      )}
      {title && <span className="text-gray-400">|</span>}
      {title && <span className="text-sm text-gray-500">{title}</span>}
    </div>
  )
}
