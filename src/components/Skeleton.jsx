// Pulsing placeholder rows that mirror the result/inventory card layout.
export default function Skeleton({ rows = 5 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-800 border border-zinc-700/40 rounded-2xl px-4 py-3.5 flex items-center gap-3 animate-pulse"
        >
          <div className="w-11 h-11 rounded-xl bg-zinc-700/60 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-zinc-700/60 rounded w-1/2" />
            <div className="h-2.5 bg-zinc-700/40 rounded w-1/3" />
          </div>
          <div className="w-10 h-6 rounded-lg bg-zinc-700/50 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
