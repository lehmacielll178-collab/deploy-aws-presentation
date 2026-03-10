import { Scissors } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-ink-200/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded flex items-center justify-center">
            <Scissors className="w-4 h-4 text-gold" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              Barber Shop
            </span>
            <span className="hidden sm:inline text-ink-400 text-xs font-mono uppercase tracking-widest">
              — Est. 2024
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-ink-500 font-body">Agendamentos abertos</span>
        </div>
      </div>
    </header>
  )
}
