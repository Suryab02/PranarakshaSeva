import { useToasts } from '../toast'

const TOAST_STYLES = {
  success: 'bg-emerald-600/90 border-emerald-400/40 text-white',
  error: 'bg-red-600/90 border-red-400/40 text-white',
  info: 'bg-zinc-800/95 border-zinc-600/50 text-zinc-100',
}

/**
 * On mobile: pages render edge-to-edge (unchanged).
 * On desktop (lg+): the whole app floats inside a phone-style frame on an
 * ambient red-glow backdrop, so it looks intentional instead of stretched.
 */
export default function AppShell({ children }) {
  const toasts = useToasts()

  return (
    <div className="min-h-screen w-full bg-zinc-950 lg:flex lg:items-center lg:justify-center lg:p-6">
      {/* ambient backdrop — desktop only */}
      <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[820px] h-[520px] bg-red-700/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-[15%] right-[8%] w-[420px] h-[420px] bg-red-900/10 rounded-full blur-[110px]" />
      </div>

      {/* phone frame */}
      <div className="relative w-full bg-zinc-950 lg:w-[400px] lg:h-[90vh] lg:max-h-[860px] lg:rounded-[2.6rem] lg:border lg:border-zinc-800 lg:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] lg:overflow-hidden">
        <div className="h-full lg:overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* toaster — viewport-fixed on mobile, frame-anchored on desktop */}
        <div className="fixed lg:absolute inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-6 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-md animate-toast ${TOAST_STYLES[t.type] || TOAST_STYLES.info}`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
