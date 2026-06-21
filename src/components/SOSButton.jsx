import { useState } from 'react'

const EMERGENCY_NUMBERS = [
  { label: 'Ambulance', number: '108', icon: '🚑' },
  { label: 'Medical Emergency', number: '102', icon: '🏥' },
  { label: 'Police', number: '100', icon: '🚔' },
  { label: 'National Emergency', number: '112', icon: '📞' },
]

export default function SOSButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold animate-pulse-slow transition-transform hover:scale-110"
        title="Emergency SOS"
      >
        SOS
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">🆘 Emergency Numbers</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {EMERGENCY_NUMBERS.map(({ label, number, icon }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="flex items-center justify-between bg-red-50 hover:bg-red-100 rounded-xl px-4 py-3 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-gray-700">{label}</span>
                  </span>
                  <span className="text-red-600 font-bold text-lg">{number}</span>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">
              Tap a number to call directly
            </p>
          </div>
        </div>
      )}
    </>
  )
}
