export default function EmptyState({ message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <p className="font-bold text-zinc-300 text-[15px]">{message ?? 'No results found'}</p>
      {sub && <p className="text-zinc-600 text-sm mt-1">{sub}</p>}
    </div>
  )
}
