import { useState } from 'react'

const EMERGENCY_NUMBERS = [
  { label: 'Ambulance', number: '108', color: 'bg-red-600' },
  { label: 'Medical Emergency', number: '102', color: 'bg-orange-500' },
  { label: 'Police', number: '100', color: 'bg-blue-600' },
  { label: 'National Emergency', number: '112', color: 'bg-zinc-700' },
]

export default function SOSButton({ city }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const copyNumber = (e, number) => {
    e.preventDefault()
    navigator.clipboard.writeText(number).then(() => {
      setCopied(number)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed lg:absolute bottom-6 right-6 z-50 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center text-[11px] font-black tracking-wider ring-pulse shadow-xl shadow-red-600/50 hover:bg-red-500 transition-colors"
        title="Emergency SOS"
      >
        SOS
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-white font-black text-lg">Emergency</p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {city ? `${city} · ` : ''}Tap to call · hold to copy
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-3 space-y-1">
              {EMERGENCY_NUMBERS.map(({ label, number, color }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  onContextMenu={(e) => copyNumber(e, number)}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 hover:bg-zinc-900 transition-colors group"
                >
                  <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                    {number}
                  </div>
                  <span className="text-zinc-300 font-medium text-[15px] flex-1">{label}</span>
                  {copied === number ? (
                    <span className="text-green-400 text-xs font-semibold">Copied!</span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => copyNumber(e, number)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-all p-1"
                      title="Copy number"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    </button>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
